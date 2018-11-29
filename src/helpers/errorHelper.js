export const missingFieldsMessage = textParts =>
  textParts.length > 1
    ? `missing required ${textParts
        .slice(0, -1)
        .join(',')} and ${textParts.slice(-1)} fields`
    : `missing required ${textParts[0]} field`;

export default (
  response,
  errors = ['Oops an unknown error occured. Please try again'],
  code = 500
) =>
  response.status(code).json({
    errors: errors instanceof Array ? errors : [errors],
  });
