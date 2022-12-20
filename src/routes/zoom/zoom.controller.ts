import axios from 'axios';
import { Response, NextFunction, Request } from 'express';
import { ZOOM_CLIENT_ID, ZOOM_CLIENT_SECRET, ZOOM_OAUTH_ENDPOINT, ZOOM_REDIRECT_URI } from '@/config';
import { HttpException } from '@exceptions/HttpException';
import { URLSearchParams } from 'url';
import { generalResponse } from '@/helpers/common.helper';

export default class ZoomController {
  constructor() {
    // do nothing
  }

  readonly getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.body;
      if (!ZOOM_OAUTH_ENDPOINT) {
        throw new HttpException(404, 'Configuration Not Found !!');
      }

      const body = Buffer.from(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`).toString('base64');

      const params = new URLSearchParams({
        code: code,
        redirect_uri: `${ZOOM_REDIRECT_URI}`,
        grant_type: 'authorization_code',
      }).toString();

      const response = await axios.post(`${ZOOM_OAUTH_ENDPOINT}/token`, params, {
        headers: {
          Authorization: `Basic ${body}`,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(params),
        },
      });

      return generalResponse(res, response.data, 'Access Token Fetched Successfully !!', 'success', false, 200);
    } catch (err) {
      next(err);
    }
  };
}
