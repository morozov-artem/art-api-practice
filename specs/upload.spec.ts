import config from '../config/base.config';
import controller from '../controller/upload-controller';

describe('categories tests', () => {
  it('POST /upload/single', async () => {
    const res = await controller.postUploadSingle('data/fries-no.png');
    console.log(res.body)

    expect(res.body.filename).toEqual('fries-no.png');
  });

  it('POST /upload/multiple', async () => {
    const res = await controller.postUploadMultiple(['data/fries-no.png', 'data/french-fries.png']);
    console.log(res.body)

    expect(res.body[0].filename).toEqual('fries-no.png');
    expect(res.body[1].filename).toEqual('french-fries.png');
  });
});