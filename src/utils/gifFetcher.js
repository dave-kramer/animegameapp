const gifs = [
  require('../../assets/gifs/gif1.gif'),
  require('../../assets/gifs/gif2.gif'),
  require('../../assets/gifs/gif3.gif'),
  require('../../assets/gifs/gif4.gif'),
];

export const fetchGameOverGif = () => {
  const randomIndex = Math.floor(Math.random() * gifs.length);
  return gifs[randomIndex];
};