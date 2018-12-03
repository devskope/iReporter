export default (response, data = [], code = 200) =>
  response
    .status(code)
    .json({ status: code, data: data instanceof Array ? data : [data] });
