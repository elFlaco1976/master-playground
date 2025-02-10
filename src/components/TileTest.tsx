import { TileState } from './Gameboard';
import styles from './TileTest.module.css';
import { Image } from '@mantine/core';

interface TileProps {
  state: TileState;
  handleClick: (id: string) => void;
}

const TileTest = ({
  state: { imageUrl, id, tileStatus },
  handleClick
}: TileProps) => {
  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('Tile clicked');
    handleClick(id);
  };

  return (
    <div className={styles.tileContainer} onClick={onClick}>
      <div
        className={`${styles.tile} ${
          tileStatus === 'isBack' ? styles.isFlipped : ''
        }`}
      >
        <div className={`${styles.tileFace} ${styles.tileFront}`}>
          <Image src={imageUrl} />
        </div>
        <div className={`${styles.tileFace} ${styles.tileBack}`}>?</div>
      </div>
    </div>
  );
};

export default TileTest;
