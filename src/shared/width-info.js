/**
 * Provides crossbrowser way to find out document width
 * @return {number} width of the document
 */
const widthInfo = () => {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
};

export default widthInfo;
