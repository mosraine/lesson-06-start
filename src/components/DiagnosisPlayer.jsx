// ① ここに、useState の import を書く
import diagnosis from "../data/diagnosis.json";
import { judge } from "../lib/score";
import ResultView from "./ResultView";
import DebugPanel from "./DebugPanel";
import { useState } from "react"; /* A1.使用 useState 记住当前题号*/

function DiagnosisPlayer() {
  /* A2.質問番号を useState で覚える */
  const [currentQuestion, setCurrentQuestion] = useState(0);
  // currentQuestion:今の値 ＆ setCurrentQuestion:更新函数
  // useState(0)	创建状态，初始值为0
  
  // state：Reactが覚えている値 ＆ setState：stateを更新する関数
  // stateが更新されると、Reactが自動的に画面を更新する

  // ④ 回答記録を useState で覚える
  const [answers, setAnswers] = useState({});
  const question = diagnosis.questions[currentQuestion];
  const isFinished = question === undefined;

  // 次の質問へ進む（最後の質問では止まる）
  function handleNext() {
    //判断：现在是不是最后一题？
    if (currentQuestion < diagnosis.questions.length - 1) {
      /* A3.ここで、質問番号を更新する */
      setCurrentQuestion(currentQuestion + 1); //把当前题号加1，并让 React 更新画面。
    }
  }

  // 選んだ答えを、回答記録に入れる（配布済み。読むだけ）
  function handleChoose(choice) {
    setAnswers((previous) => ({
      ...previous,
      [question.id]: choice.id,
    }));
  }

  // 「回答して進む」ボタンで使う（配布済み）
  function handleAnswerNext() {
    setCurrentQuestion(currentQuestion + 1);
  }

  // 最初の質問・空の回答記録へ戻す（配布済み）
  function handleReset() {
    setCurrentQuestion(0);
    setAnswers({});
  }

  if (isFinished) {
    const { scores, result } = judge(diagnosis, answers);
    return (
      <ResultView
        diagnosis={diagnosis}
        scores={scores}
        result={result}
        onReset={handleReset}
      />
    );
  }

  const selectedId = answers[question.id];

  return (
    <section className="player">
      <p className="progress">
        質問 {currentQuestion + 1} / {diagnosis.questions.length}
      </p>
      <h2>{question.text}</h2>

      <div className="choices">
        {question.choices.map((choice) => (
          <button
            key={choice.id}
            className={choice.id === selectedId ? "choice selected" : "choice"}
            /* ⑤ onClick を書く */
            onClick={() => handleChoose(choice)}
          >
            {choice.text}
          </button>
        ))}
      </div>

      <button
        className="next"
        onClick={handleAnswerNext}
        disabled={!answers[question.id]}
      >
        回答して進む
      </button>

      <DebugPanel currentQuestion={currentQuestion} answers={answers} />
    </section>
  );
}

export default DiagnosisPlayer;
