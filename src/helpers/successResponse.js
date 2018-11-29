export default (response, data = [], code = 200) =>
  response.status(code).json({
    data: data instanceof Array ? data : [data],
  });
