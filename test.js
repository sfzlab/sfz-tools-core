const fs = require("fs").promises;
const fs2 = require("fs");
const flac = require("flac-bindings");
const wav =  require("wav");

async function* readWaveChunks(path) {
  const file = await fs.open(path, "r");
  try {
    // I'm not sure if I should keep
    let position = null;
    const riffHeader = await file.read({ length: 8, position });
    position += riffHeader.bytesRead;
    if (
      riffHeader.bytesRead < 8 ||
      riffHeader.buffer.subarray(0, 4).toString("ascii") !== "RIFF"
    ) {
      console.log(position, riffHeader.buffer);
      return;
    }

    const fileSize = riffHeader.buffer.readInt32LE(4);
    const waveHeader = await file.read({ length: 4, position });
    position += waveHeader.bytesRead;
    if (
      waveHeader.bytesRead < 4 ||
      waveHeader.buffer.subarray(0, 4).toString("ascii") !== "WAVE"
    ) {
      console.log(position, waveHeader.buffer);
      return;
    }

    let chunkBuffer = await file.read({ length: 8, position });
    position += chunkBuffer.bytesRead;
    while (chunkBuffer.bytesRead === 8 && position < fileSize) {
      const chunkType = chunkBuffer.buffer.subarray(0, 4).toString("ascii");
      const chunkSize = chunkBuffer.buffer.readInt32LE(4);
      const chunkSizeToRead = chunkSize + (chunkSize % 2);
      if (chunkType === "data") {
        position += chunkSizeToRead;
        // skipping data chunk on purpose
        chunkBuffer = await file.read({ length: 8, position });
        position += chunkBuffer.bytesRead;
        continue;
      }

      const chunkData = await file.read({
        length: chunkSize + (chunkSize % 2),
        position: null,
      });
      position += chunkData.bytesRead;
      if (chunkData.bytesRead < chunkSizeToRead) {
        return;
      }

      yield {
        type: chunkType,
        size: chunkSize,
        raw: Buffer.concat([
          chunkBuffer.buffer.subarray(0, 8),
          chunkData.buffer.subarray(0, chunkSizeToRead),
        ]),
      };

      chunkBuffer = await file.read({ length: 8, position });
      position += chunkBuffer.bytesRead;
    }
  } finally {
    await file?.close();
  }
}

async function init() {
  const riffChunks = [];
  const riffApplicationMetadata = new flac.api.metadata.ApplicationMetadata();
  riffApplicationMetadata.id = Buffer.from("riff");
  riffChunks.push(riffApplicationMetadata);
  for await (const chunk of readWaveChunks("./test/metadata.wav")) {
    console.log(chunk.type, chunk.size);
    if (riffApplicationMetadata.data.length) {
      riffApplicationMetadata.data = Buffer.concat([riffApplicationMetadata.data, chunk.raw]);
    } else {
      riffApplicationMetadata.data = chunk.raw;
    }
  }

  console.log(riffChunks);
  
  // create encoder with the metadata block
  const flacEncoder = new flac.FileEncoder({
    file: "./test/metadata.flac",
    compressionLevel: 9,
    metadata: riffChunks,
  });
  const wavReader = new wav.Reader();
  const fileHandle = await fs.open("./test/metadata.wav");
  const fileStream = fileHandle.createReadStream({ autoClose: true });
  fileStream
    .pipe(wavReader)
    .pipe(flacEncoder)
    .on("close", () => {
      console.log("done");
    })
    .on("error", (error) => {
      console.error("Failed encoding", error);
    });
}

init();



const riffChunks = require("riff-chunks").riffChunks;
let chunks = riffChunks(fs2.readFileSync("./test/metadata.wav"));
console.log('riffChunks', chunks);


const fs = require('fs');

function read_from_wave(fm, f, error) {
  const buffer = Buffer.alloc(12);
  let offset, eof_offset = -1, ds64_data_size = -1;

  try {
    offset = fs.statSync(f).size;
  } catch (err) {
    if (error) error[0] = "ftello() error (001)";
    return false;
  }

  if (offset < 0) {
    if (error) error[0] = "ftello() error (001)";
    return false;
  }

  try {
    fs.readSync(f, buffer, 0, 12, offset);
  } catch (err) {
    if (error) error[0] = "Error reading file (002)";
    return false;
  }

  if (buffer.toString('utf8', 0, 4) !== 'RIFF' && buffer.toString('utf8', 0, 4) !== 'RF64') {
    if (error) error[0] = "unsupported RIFF layout (002)";
    return false;
  }

  if (buffer.toString('utf8', 8, 12) !== 'WAVE') {
    if (error) error[0] = "unsupported RIFF layout (002)";
    return false;
  }

  if (buffer.toString('utf8', 0, 4) === 'RF64') {
    fm.is_rf64 = true;
  }

  if (fm.is_rf64 && Buffer.from(FLAC__off_t).length < 8) {
    if (error) error[0] = "RF64 is not supported on this compile (r00)";
    return false;
  }

  if (!append_block_(fm, offset, 12, error)) return false;

  if (!fm.is_rf64 || unpack32le_(buffer.slice(4, 8)) !== 0xffffffff) {
    eof_offset = 8 + unpack32le_(buffer.slice(4, 8));
    if (eof_offset & 1) /* fix odd RIFF size */
      eof_offset++;
  }

  // Continue translating the rest of the C++ code to JavaScript...

  // You will need to implement append_block_, unpack32le_, and unpack64le_ functions.
}

// Example usage:
const fm = {
  is_rf64: false,
  format_block: 0, // Initialize these values according to your requirements
  audio_block: 0,
  num_blocks: 0,
};
const error = [null];

const result = read_from_wave(fm, 'your_wave_file.wav', error);

if (result) {
  console.log('Wave file is valid.');
} else {
  console.error('Error:', error[0]);
}



// // console.log(chunks.subChunks[0].chunkData);
// const WaveFile = require('wavefile').WaveFile;

// Load a wav file buffer as a WaveFile object
// const buffer = fs.readFileSync("./test/metadata.wav");
// let wav = new WaveFile(buffer);

// // // Check some of the file properties
// console.log(wav.container);
// console.log(wav.chunkSize);
// console.log(wav.fmt.chunkId);
// console.log(wav.LIST);
// console.log(wav._PMX);
// console.log(wav.);

// const readHeader = buffer => {
//   let offset = 0;

//   const riffHead = buffer.slice(offset, offset + 4).toString();
//   offset += 4;

//   const fileSize = buffer.readUInt32LE(offset);
//   offset += 4;

//   const waveHead = buffer.slice(offset, offset + 4).toString();
//   offset += 4;

//   const fmtHead = buffer.slice(offset, offset + 4).toString();
//   offset += 4;

//   const formatLength = buffer.readUInt32LE(offset);
//   offset += 4;

//   const audioFormat = buffer.readUInt16LE(offset);
//   offset += 2;

//   const channels = buffer.readUInt16LE(offset);
//   offset += 2;

//   const sampleRate = buffer.readUInt32LE(offset);
//   offset += 4;

//   const byteRate = buffer.readUInt32LE(offset);
//   offset += 4;

//   const blockAlign = buffer.readUInt16LE(offset);
//   offset += 2;

//   const bitDepth = buffer.readUInt16LE(offset);
//   offset += 2;

//   const data = buffer.slice(offset, offset + 4).toString();
//   offset += 4;

//   const dataLength = buffer.readUInt32LE(offset);
//   offset += 4;

//   return {
//     riffHead,
//     fileSize,
//     waveHead,
//     fmtHead,
//     formatLength,
//     audioFormat,
//     channels,
//     sampleRate,
//     byteRate,
//     blockAlign,
//     bitDepth,
//     data,
//     dataLength
//   };
// };