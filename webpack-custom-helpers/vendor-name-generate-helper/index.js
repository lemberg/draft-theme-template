/**
 * Help for cutting vendor chunk name
 * @param {Array.<Chunk>} chunks chunks goes from webpack name function
 * @param {string} cacheGroupKey goes from webpack name function
 * @param {number} vendorChunkNameLengthRestriction apply name length restriction
 * @return @type {string} vendor name
 */

const getVendorName = (
  chunks,
  cacheGroupKey,
  vendorChunkNameLengthRestriction,
) => {
  const name = [cacheGroupKey];
  chunks.forEach(chunk => {
    name.push(`${chunk.name.split('/')[0]}`);
  });
  if (name.length > vendorChunkNameLengthRestriction) {
    if (vendorChunkNameLengthRestriction > 1) {
      name.splice(vendorChunkNameLengthRestriction - 1);
    } else {
      name.splice(vendorChunkNameLengthRestriction);
    }
  }
  return `vendors/${name.join('-')}`;
};

module.exports = getVendorName;
