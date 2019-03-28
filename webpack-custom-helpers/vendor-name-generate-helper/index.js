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
  vendorChunkNameLengthRestriction = 2,
) => {
  const name = [cacheGroupKey];
  chunks.forEach(chunk => {
    const fullPath = chunk.name.split('/');
    const baseName = fullPath[fullPath.length - 1];
    name.push(baseName);
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
