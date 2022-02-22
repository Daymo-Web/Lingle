import { useState, useEffect, useRef } from "react";
import scrabbleArray from "./scrabble";
import wordArray from "./words";
import "./App.css";
// import { Modal } from "react-bootstrap";
// import "bootstrap/dist/css/bootstrap.css";
import Select from "react-select";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    // right: "auto",
    // bottom: "",
    backgroundColor: "#ffadad",
    marginRight: "-50%",
    minHeight: "80%",
    transform: "translate(-50%, -50%)",
  },
};
Modal.setAppElement();
function App() {
  const [words, setWords] = useState([]);
  const [scrabble, setScrabble] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [length, setLength] = useState(0);
  const [tmpLength, setTmpLength] = useState(3);
  const [word, setWord] = useState([]);
  const [wordString, setWordString] = useState("");
  const [submitButton, setSubmitButton] = useState(false);
  const [answer, setAnswer] = useState();
  const [valid, setValid] = useState(false);
  const [debug, setDebug] = useState(false);
  const [cnt, setCnt] = useState(0);
  const [guesses, setGuesses] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [wordHash, setWordHash] = useState({});
  const [hashList, setHashList] = useState([]);
  const input = useRef(document.forms);
  const [keys, setKeys] = useState({});
  const [show, setShow] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);

  const back = useRef(document.body.outerHTML);
  let colors = [
    { label: "Dark Mode", value: "#292132" },
    { label: "Light Mode", value: "#ffffff" },
  ];
  // var markup = document.documentElement.innerHTML;
  let subtitle;
  const [setbgcolor, ddlvalue] = useState(colors.title);
  const ddlHandle = (e) => {
    ddlvalue(e.value);
  };

  const handleChange = (e) => {
    if (e.key === "Backspace" || e.keyCode === 37 || e.keyCode === 39) {
      return;
    }
    const { maxLength, value, name } = e.target;
    const [fieldName, fieldIndex] = name.split("-");
    console.log(value.length);
    // Check if they hit the max character length
    // Check if it's not the last input field
    const form = e.target.form;
    const index = [...form].indexOf(e.target);
    const newArray = Array.from(word);
    if (value.length === maxLength || value) {
      newArray[index] = value;
      setWord(newArray);
      if (index === length - 1) {
        setSubmitButton(true);
        return;
      }
      form.elements[index + 1].focus();
      e.preventDefault();
    }
  };

  const handleBackspace = (e) => {
    const { maxLength, value, name } = e.target;
    if (value.length === 0) {
      const form = e.target.form;
      const index = [...form].indexOf(e.target);
      const newArray = Array.from(word);
      newArray[index] = "";
      setWord(newArray);
      if (index !== 0) {
        form.elements[index - 1].focus();
      }

      e.preventDefault();
      // console.log(index);
    }
  };

  const handleLeft = (e) => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);

    if (index !== 0) {
      form.elements[index - 1].focus();
    }

    e.preventDefault();
    // console.log(index);
  };

  const handleRight = (e) => {
    const form = e.target.form;
    const index = [...form].indexOf(e.target);

    if (index !== length - 1) {
      form.elements[index + 1].focus();
    }

    e.preventDefault();
    // console.log(index);
  };

  const crossBoard = (
    <div className="cross-board" on>
      <div>
        <form id="cross" ref={input}>
          {Array.from({ length: length }, (_, k) => (
            <input
              className="cross-board-input"
              id={`cross-board-input-${k}`}
              type="text"
              name="name"
              key={k}
              defaultValue={""}
              maxLength={1}
              // onKeyUp={(e) => {
              // }}
              onInput={handleChange}
              onKeyDown={(e) => {
                if (e.key === "Backspace") {
                  handleBackspace(e);
                } else if (e.keyCode === 37) {
                  handleLeft(e);
                } else if (e.keyCode === 39) {
                  handleRight(e);
                } else if (e.key === "Enter") {
                  handleChange(e);
                  updateWord(e);
                }
              }}
            ></input>
          ))}
        </form>
      </div>
    </div>
  );

  const setWordArray = () => {
    let arr = Array(tmpLength);
    for (let i = 0; i < tmpLength; ++i) {
      arr[i] = "";
    }
    setWord(arr);
  };

  useEffect(() => {}, [words, scrabble]);

  const play = () => {
    setPlaying(true);
  };

  const filterWords = () => {
    const res = scrabbleArray.filter((s) => s.length == tmpLength);
    setScrabble(res);
  };

  const randomWord = () => {
    const res = wordArray.filter((s) => s.length == tmpLength);
    const random = res[Math.floor(Math.random() * res.length)];
    setAnswer(random);
    setWords(res);
    // console.log(random);
  };

  const updateWord = () => {
    const str = word.join("");
    setWordString(str);

    if (str == answer) {
      setCorrect(true);
      console.log("Correct!!!!!!!");
    }
    const isValid = checkWords(str);
    if (isValid) {
      setDebug(false);
      backend(str);
      if (guesses.length === 0) {
        setGuesses([word]);
      } else {
        setGuesses([...guesses, word]);
      }
      setCnt(cnt + 1);
    } else {
      setDebug(true);
    }
    try {
      input.current.reset();
      input.current.elements[0].focus();
    } catch (e) {
      console.log(e.error);
    }
  };

  // const allSqaures = (
  //   <div className="allSquares">
  //     <div>{Array.from({ cnt }, (_, k) => ({ squares }))}</div>
  //   </div>
  // );

  const SquareGuesses = () => {
    let fullStr = [];
    for (let i = 0; i < guesses.length; ++i) {
      let currGuess = guesses[i];
      fullStr.push(
        <div id="square">
          <div className="parent">
            {Array.from({ length: length }, (_, k) => (
              <div
                key={k}
                style={{ backgroundColor: hashList[i][k] }}
                className="child inline-block-child"
                id={`inline-block-child${k}`}
              >
                {currGuess[k].toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return fullStr;
  };

  const checkWords = (str) => {
    return scrabble.includes(str.toUpperCase()) || words.includes(str);
  };

  let dictionary = {
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    e: 0,
    f: 0,
    g: 0,
    h: 0,
    i: 0,
    j: 0,
    k: 0,
    l: 0,
    m: 0,
    n: 0,
    o: 0,
    p: 0,
    q: 0,
    r: 0,
    s: 0,
    t: 0,
    u: 0,
    v: 0,
    w: 0,
    x: 0,
    y: 0,
    z: 0,
  };

  let dictionary2 = {
    a: [],
    b: [],
    c: [],
    d: [],
    e: [],
    f: [],
    g: [],
    h: [],
    i: [],
    j: [],
    k: [],
    l: [],
    m: [],
    n: [],
    o: [],
    p: [],
    q: [],
    r: [],
    s: [],
    t: [],
    u: [],
    v: [],
    w: [],
    x: [],
    y: [],
    z: [],
  };

  let wordMap = [];

  const backend = (wordString) => {
    let keyboard = {};
    // console.log(keys);
    if (Object.keys(keys).length == 0) {
      // console.log("testing1");
      let c = "white";
      keyboard = {
        a: c,
        b: c,
        c: c,
        d: c,
        e: c,
        f: c,
        g: c,
        h: c,
        i: c,
        j: c,
        k: c,
        l: c,
        m: c,
        n: c,
        o: c,
        p: c,
        q: c,
        r: c,
        s: c,
        t: c,
        u: c,
        v: c,
        w: c,
        x: c,
        y: c,
        z: c,
      };
    } else {
      // console.log("testing2");
      keyboard = keys;
    }
    // console.log(keyboard);
    for (let i = 0; i < wordString.length; ++i) {
      let idxStr = i.toString();
      wordMap.push("");
    }
    for (let i = 0; i < answer.length; ++i) {
      ++dictionary[answer.charAt(i)];
    }
    let tmpDict = dictionary;
    for (let i = 0; i < wordString.length; ++i) {
      dictionary2[wordString.charAt(i)].push(i);
    }
    for (let i = 0; i < wordString.length; ++i) {
      let currLetter = wordString.charAt(i);
      if (wordMap[i] === "") {
        if (tmpDict[currLetter] === 0) {
          for (let j = 0; j < dictionary2[currLetter].length; ++j) {
            wordMap[dictionary2[currLetter][j]] = "grey";
            keyboard[currLetter] = "grey";
          }
        } else if (dictionary2[currLetter].length === 1) {
          if (currLetter == answer.charAt(i)) {
            wordMap[i] = "#30c93b";
            keyboard[currLetter] = "#30c93b";
          } else {
            wordMap[i] = "#e1b137";
            if (keyboard[currLetter] === "white") {
              keyboard[currLetter] = "#e1b137";
            }
          }
        } else {
          let tmpLst = dictionary2[currLetter];
          let tmpLst2 = tmpLst;
          for (let j = 0; j < tmpLst2.length; ++j) {
            let k = tmpLst2[j];
            if (currLetter == answer.charAt(k)) {
              tmpDict[currLetter] -= 1;
              tmpLst = tmpLst.filter((i) => i !== k);
              wordMap[k] = "#30c93b";
              keyboard[currLetter] = "#30c93b";
            }
          }
          tmpLst2 = tmpLst;
          for (let j = 0; j < tmpLst2.length; ++j) {
            let k = tmpLst[j];
            if (tmpDict[currLetter] <= 0) {
              wordMap[k] = "grey";
              if (keyboard[currLetter] === "white") {
                keyboard[currLetter] = "grey";
              }
            } else {
              tmpDict[currLetter] -= 1;
              wordMap[k] = "#e1b137";
              if (keyboard[currLetter] === "white") {
                keyboard[currLetter] = "#e1b137";
              }
            }
          }
        }
      }
    }
    // console.log(keyboard);
    setKeys(keyboard);
    setWordHash(wordMap);
    let hashy = hashList;
    hashy.push(wordMap);
    setHashList(hashy);
  };

  let row1 = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"];
  let len1 = row1.length;
  let row2 = ["a", "s", "d", "f", "g", "h", "j", "k", "l"];
  let len2 = row2.length;
  let row3 = ["z", "x", "c", "v", "b", "n", "m"];
  let len3 = row3.length;
  const KeyboardRender = () => {
    return (
      <div className="keys">
        <div className="parent">
          {Array.from({ length: len1 }, (_, k) => (
            <div
              key={k}
              style={{ backgroundColor: keys[row1[k]] }}
              className="keyboard"
            >
              {row1[k].toUpperCase()}
            </div>
          ))}
        </div>
        <div className="parent">
          {Array.from({ length: len2 }, (_, k) => (
            <div
              key={k}
              style={{ backgroundColor: keys[row2[k]] }}
              className="keyboard"
            >
              {row2[k].toUpperCase()}
            </div>
          ))}
        </div>
        <div className="parent">
          {Array.from({ length: len3 }, (_, k) => (
            <div
              key={k}
              style={{ backgroundColor: keys[row3[k]] }}
              className="keyboard"
            >
              {row3[k].toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const PlayAgain = () => {
    setLength(0);
    setGuesses([]);
    setCorrect(false);
    setPlaying(false);
    setKeys({});
    setHashList([]);
    setWordHash({});
  };
  const selectLength = () => {
    setWordArray();
    randomWord();
    filterWords();
    setLength(tmpLength);
    input.current.elements[0].focus();
  };
  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#ae2012";
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <div className="App">
      <div className="circles">
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>
        <div className="circle-4"></div>
        <div className="circle-5"></div>
        <div className="circle-6"></div>
        <div className="circle-7"></div>
        <div className="circle-8"></div>
        <div className="circle-9"></div>
        <div className="circle-10"></div>
        <div className="circle-11"></div>
        <div className="circle-12"></div>
        <div className="circle-13"></div>
        <div className="circle-14"></div>
        <div className="circle-15"></div>
        <div className="circle-16"></div>
        <div className="circle-17"></div>
        <div className="circle-18"></div>
        <div className="circle-19"></div>
        <div className="circle-20"></div>
      </div>

      <div className="header">
        <style>{"html {background-color:" + setbgcolor + ";}"}</style>
        <Select
          className="select"
          defaultValue={colors[0]}
          options={colors}
          onChange={ddlHandle}
          placeholder="Dark Mode"
          theme={(theme) => ({
            ...theme,
            borderRadius: "20px",
          })}
        ></Select>
        <div>
          <h1>You are playing Lingle!</h1>
        </div>
      </div>
      <div className="body">
        {length > 2 ? (
          <div>
            {cnt > 0 ? (
              <div className="square-guesses">
                <SquareGuesses />
              </div>
            ) : (
              <div></div>
            )}

            {!correct ? (
              <div className="game-body">
                <div>{crossBoard}</div>
                {submitButton === true && debug === true ? (
                  <div>
                    <button
                      className="button"
                      type="button"
                      onClick={updateWord}
                    >
                      Enter
                    </button>
                    <h3>Not a valid word! Try Again!</h3>
                  </div>
                ) : submitButton === true ? (
                  <button className="button" type="button" onClick={updateWord}>
                    Enter
                  </button>
                ) : (
                  <div></div>
                )}
                <div>
                  <div className="keys">
                    <KeyboardRender />
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h1>You Win! Play Again?</h1>
                <button className="button" onClick={PlayAgain}>
                  Play Again
                </button>
              </div>
            )}
          </div>
        ) : playing === true ? (
          <div>
            <h2>Select Lingle word length: </h2>
            <form>
              <input
                autoFocus
                className="numbox"
                min={3}
                type="number"
                value={tmpLength}
                onChange={(res) => setTmpLength(res.target.value)}
              />
              <input
                className="button"
                type="submit"
                value="Submit"
                onClick={selectLength}
              />
            </form>
          </div>
        ) : (
          <div>
            <button className="button" onClick={play}>
              Play now
            </button>

            <button className="button" onClick={openModal}>
              Info
            </button>
            <Modal
              isOpen={modalIsOpen}
              onAfterOpen={afterOpenModal}
              onRequestClose={closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <h2 ref={(_subtitle) => (subtitle = _subtitle)}>
                What is Lingle?
              </h2>

              <div>
                <p>
                  Lingle is an adaptation to a popular NY times game called
                  Wordle.{" "}
                  <a href="https://www.nytimes.com/games/wordle/index.html">
                    Click here to check out the original Wordle Game.
                  </a>
                </p>
                <p>
                  The rules to Worldle are simple. Just guess a word. Any word
                  with five letters. Hints will appear after each word guess,
                  showing whether letters are in the right spot, in the word but
                  in the wrong spot, or not in the word at all. Using these
                  hints, make another guess and repeat until you’ve got the word
                  — or don’t get the word, and lose.
                </p>
                <p>
                  If the color of the hint is{" "}
                  <span className="green">green</span>, the letter is in the
                  word and in the correct spot.
                </p>
                <p>
                  If the color of the hint is{" "}
                  <span className="yellow">yellow</span>, the letter is in the
                  word but is in the wrong spot.
                </p>
                <p>
                  If the color of the hint is <span className="grey">grey</span>
                  , the letter is not in the word and should be discarded.
                </p>
                <p>
                  We extended gameplay functionalities in Lingle from Wordle. In
                  wordle, users get 6 tries to guess the word; we allowed
                  unlimited tries for users to guess the word. We allowed users
                  to choose what letter words they want to play with, rather
                  than the default five ltter words from Wordle. We also
                  implemented a Play Again function, where Wordle only lets you
                  play their game once a day.
                </p>
                <p1>Creators: David Ha 🤪 & Jamison Homatas 🙂</p1>
              </div>
              <button onClick={closeModal}>close</button>
            </Modal>
            <div>
              {/* <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton={true}>
                  <Modal.Title>Modal</Modal.Title>
                </Modal.Header>
                <Modal.Body>Modal body content</Modal.Body>
              </Modal> */}
            </div>
          </div>
        )}
      </div>

      <Modal show={show}></Modal>
    </div>
  );
}

export default App;
