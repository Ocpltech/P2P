import { Request, Response, NextFunction } from 'express';
import createDOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

const sanitizeValue = (value: any): any => {
  if (typeof value === 'string') {
    return DOMPurify.sanitize(value);
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }
  if (typeof value === 'object' && value !== null) {
    return Object.keys(value).reduce((acc, key) => ({
      ...acc,
      [key]: sanitizeValue(value[key])
    }), {});
  }
  return value;
};

export const sanitizeMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  req.body = sanitizeValue(req.body);
  req.query = sanitizeValue(req.query);
  req.params = sanitizeValue(req.params);
  next();
};