import { useState } from 'react';
import Tile from './Tile';
import styles from './Gameboard.module.css';
import { shuffleArray } from 'utils';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import TileTest from './TileTest';

const getImageUrls = () =>
  Array.from(
    { length: 8 },
    (value, index) => `https://picsum.photos/200?random=${index}`
  );

const getImageUrlsForAllTiles = () =>
  shuffleArray([...getImageUrls(), ...getImageUrls()]);

type TileStatus =
  | 'isFront'
  | 'isBack'
  | 'isOpening'
  | 'isClosing'
  | 'isMatched';

export interface TileState {
  id: string;
  imageUrl: string;
  tileStatus: TileStatus;
}

export interface GameboardState {
  tiles: TileState[];
  openedPair: TileState[];
}

const getInitialGameboardState = (): GameboardState => {
  const imageUrls = getImageUrlsForAllTiles();
  return {
    tiles: imageUrls.map((imageUrl, index) => ({
      id: index.toString(),
      imageUrl,
      tileStatus: 'isBack'
    })),
    openedPair: []
  };
};

const loadImages = async () => {
  const imageRequests = getImageUrls().map((imageUrl) =>
    axios({ method: 'get', url: imageUrl })
  );
  await Promise.all(imageRequests);
};

const Gameboard = () => {
  const result = useQuery({
    queryKey: ['images'],
    queryFn: loadImages,
    refetchOnWindowFocus: false
  });

  const [gameboardState, setGameboardState] = useState(
    getInitialGameboardState()
  );

  if (result.isLoading) {
    return <>Loading images</>;
  }

  const handleTileClick = (id: string) => {
    setGameboardState((prevGameboardState) => {
      if (prevGameboardState.openedPair.length === 2) {
        return prevGameboardState;
      }

      if (
        prevGameboardState.openedPair.some((openedTile) => openedTile.id === id)
      ) {
        return prevGameboardState;
      }

      const updatedOpenedPair = [...prevGameboardState.openedPair];

      const updatedTiles = prevGameboardState.tiles.map((tileState) => {
        if (tileState.id === id) {
          let newStatus: TileStatus = 'isBack';
          if (tileState.tileStatus === 'isBack') {
            newStatus = 'isFront';
            updatedOpenedPair.push({ ...tileState, tileStatus: newStatus });
          } else if (tileState.tileStatus === 'isFront') {
            return tileState;
          }

          return { ...tileState, tileStatus: newStatus };
        }
        return tileState;
      });

      return { tiles: updatedTiles, openedPair: updatedOpenedPair };
    });
  };

  return (
    <main className={styles.gridContainer}>
      {gameboardState.tiles.map((tileState, index) => (
        <TileTest state={tileState} key={index} handleClick={handleTileClick} />
      ))}
    </main>
  );
};

export default Gameboard;
