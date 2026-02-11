const SIGN_PREFIX_PATTERN = /^[+-]/;
const DIGIT_PATTERN = /(\d+(?:[.,]\d+)?)/;

export const formatMetricValue = (value: string): string => value.trim().replace(SIGN_PREFIX_PATTERN, '');

export const getMetricTargetValue = (value: string): number => {
  const normalizedValue = formatMetricValue(value);
  const numericMatch = normalizedValue.match(DIGIT_PATTERN);

  if (!numericMatch) {
    return 0;
  }

  return Math.round(Number.parseFloat(numericMatch[1].replace(',', '.')));
};

export const getMetricSuffix = (value: string): string => {
  const normalizedValue = formatMetricValue(value);
  const numericMatch = normalizedValue.match(DIGIT_PATTERN);

  if (!numericMatch || numericMatch.index === undefined) {
    return '';
  }

  return normalizedValue.slice(numericMatch.index + numericMatch[0].length);
};
