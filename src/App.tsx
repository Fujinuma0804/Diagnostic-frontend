import { Routes, Route, Navigate } from 'react-router-dom';
import CharacterPage from './components/CharacterPage';
import QuizPage from './components/QuizPage';
import ResultPage from './components/ResultPage';

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/blog" />} />
        <Route path="/blog" element={<CharacterPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz/result/:title" element={<ResultPage />} />
      </Routes>
      <footer style={{ textAlign: 'center', color: 'black', fontSize: '10px', padding: '10px' }}>
運営元：Cure Investment inc.
      </footer>
    </div>
  );
}
