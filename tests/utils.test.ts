import { pathJoin } from '../src/utils';

test('pathJoin', async () => {
  expect(pathJoin('https://domain.com/apple', 'banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '/banana')).toEqual('https://domain.com/apple/banana');
  expect(pathJoin('https://domain.com/apple/', '', 'banana')).toEqual('https://domain.com/apple/banana');

  expect(pathJoin('https://domain.com/apple', '../banana')).toEqual('https://domain.com/banana');
  expect(pathJoin('https://domain.com/apple/', '../banana')).toEqual('https://domain.com/banana');

  expect(pathJoin('Programs/', '', '..\\Samples\\Noise\\Slide_Noise\\Slide_Noise1.flac')).toEqual(
    'Samples/Noise/Slide_Noise/Slide_Noise1.flac'
  );
  expect(pathJoin('Programs/', '', '../Samples/Release4/e6_Rel4_4.flac')).toEqual('Samples/Release4/e6_Rel4_4.flac');
});
