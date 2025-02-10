import { Image } from '@mantine/core';
import styles from './Tile.module.css';
import { TileState } from './Gameboard';

interface TileProps {
  state: TileState;
}

const Tile = ({ state: { imageUrl } }: TileProps) => {
  return <Image src={imageUrl} className={`inline ${styles.tileItem}`} />;
};

export default Tile;
