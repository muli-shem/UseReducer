import React, { useReducer, useState } from 'react';
import './App.scss';
import JokesData from './data/data.json';

interface Joke {
  id: number;
  joke: string;
  rating: number;
}

type State = {
  jokes: Joke[];
  isEditing: boolean;
  editJokeId: number | null;
  editJokeText: string;
};

type Action =
  | { type: 'ADD_JOKE'; payload: Joke }
  | { type: 'DELETE_JOKE'; payload: number }
  | { type: 'UPDATE_RATING'; payload: { id: number; rating: number } }
  | { type: 'START_EDITING'; payload: { id: number; text: string } }
  | { type: 'CANCEL_EDITING' }
  | { type: 'SAVE_EDIT'; payload: { id: number; text: string } };

const initialState: State = {
  jokes: JokesData,
  isEditing: false,
  editJokeId: null,
  editJokeText: '',
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_JOKE':
      return { ...state, jokes: [...state.jokes, action.payload] };
    case 'DELETE_JOKE':
      return { ...state, jokes: state.jokes.filter(joke => joke.id !== action.payload) };
    case 'UPDATE_RATING':
      return {
        ...state,
        jokes: state.jokes.map(joke =>
          joke.id === action.payload.id ? { ...joke, rating: action.payload.rating } : joke
        ),
      };
    case 'START_EDITING':
      return {
        ...state,
        isEditing: true,
        editJokeId: action.payload.id,
        editJokeText: action.payload.text,
      };
    case 'CANCEL_EDITING':
      return { ...state, isEditing: false, editJokeId: null, editJokeText: '' };
    case 'SAVE_EDIT':
      return {
        ...state,
        jokes: state.jokes.map(joke =>
          joke.id === action.payload.id ? { ...joke, joke: action.payload.text } : joke
        ),
        isEditing: false,
        editJokeId: null,
        editJokeText: '',
      };
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [newJokeText, setNewJokeText] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newJoke: Joke = {
      id: state.jokes.length + 1,
      joke: newJokeText,
      rating: 0,
    };
    dispatch({ type: 'ADD_JOKE', payload: newJoke });
    setNewJokeText('');
  };

  return (
    <div className='Container'>
      <h1>Jokes for you</h1>
      <form className='add' onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Add your joke'
          value={newJokeText}
          onChange={(e) => setNewJokeText(e.target.value)}
        />
        <input type='submit' value='Submit' />
      </form>
      <div className='Jokes'>
        {state.jokes.map((joke) => (
          <div key={joke.id} className='myjokes'>
            {state.isEditing && state.editJokeId === joke.id ? (
              // Edit mode UI
              <>
                <input
                  type='text'
                  value={state.editJokeText}
                  onChange={(e) =>
                    dispatch({ type: 'START_EDITING', payload: { id: joke.id, text: e.target.value } })
                  }
                />
                <button onClick={() => dispatch({ type: 'SAVE_EDIT', payload: { id: joke.id, text: state.editJokeText } })}>
                  Save
                </button>
                <button onClick={() => dispatch({ type: 'CANCEL_EDITING' })}>Cancel</button>
              </>
            ) : (
              // Display mode UI
              <>
                <div className='joke'>{joke.joke}</div>
                <div className='rate'>{joke.rating}</div>
                <div className='button'>
                  <button onClick={() => dispatch({ type: 'UPDATE_RATING', payload: { id: joke.id, rating: joke.rating + 1 } })}>
                    👍
                  </button>
                  <button onClick={() => dispatch({ type: 'UPDATE_RATING', payload: { id: joke.id, rating: joke.rating - 1 } })}>
                    👎
                  </button>
                  <button onClick={() => dispatch({ type: 'DELETE_JOKE', payload: joke.id })}>🗑️</button>
                  <button onClick={() => dispatch({ type: 'START_EDITING', payload: { id: joke.id, text: joke.joke } })}>EDIT</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
