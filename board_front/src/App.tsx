import React from 'react';

import './App.css';
import BoardListItem from 'components/boardListItem';
import { latestBoardListMock } from 'mocks';

function App() {
  return (
    <>
    {latestBoardListMock.map(boardListItem=> <BoardListItem boardListItem ={BoardListItem}/>)}
    </>
    );
}

export default App;
