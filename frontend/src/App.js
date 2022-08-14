import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Stack, TextField } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import * as React from 'react';
import { useRef, useState } from "react";
import Draggable from 'react-draggable';
import { FlashcardArray } from "react-quizlet-flashcard";
import './App.css';


const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function App() {

  const arrayRef = useRef({})
  const [currentNumber, setCurrentNumber] = useState(1)
  const [openAccepted, setOpenAccpted] = useState(false);
  const [totalScore, setTotalScore] = useState(0)
  const [input, setInput] = useState('')
  const [isFlip, setIsFlip] = useState(false);
  const [wrongs, setWrongs] = useState([]);
  const [Scores, updateScore] = useState([]);
  const [cards, setCards] = useState([{
      id: 1,
      front: "Chờ xíu nha lấy dữ liệu tí...",
      back: "Đã bảo chờ rồi mà ?"
  }]);


  const handleCloseAccepted = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAccpted(false);
  };


  const MySnackBar = (isAccepted) => {
    if (isAccepted) {
      setOpenAccpted(true);
    }
  }

  const [openDialog, setOpenDialog] = useState(false)
  const handleCloseDialog = () => {
    setOpenDialog(false);
  }

  const F5 = () => {window.location.reload()}

  const finished = async () => {
    var temp = []
    var sc = 0
    for (let i = 0; i < cards.length; i++) {
      if (Scores[i] === 0) {
        temp.push(cards[i].back);
        await fetch("http://127.0.0.1:8000/update", {
          method: "post", 
          headers: {
            "Accept": "application/json", 
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            data: {
              id: cards[i].page_id,
              properties: {
                Score: {
                  number: cards[i].scores + 1
                }
              }
            }
          })
        })
      } else {
        sc += 1
      }
    }
    setTotalScore(sc);
    setWrongs(temp);
    setOpenDialog(true);
  }

  const handleChange = () => {

    const value = cards[currentNumber - 1].back
    if (value === input) {
      MySnackBar(true)
      if (currentNumber !== cards.length) {
        arrayRef.current.nextCard()
        setInput("")
      } else {
        finished()
      }
    }
  }

  const getData = async () => {
    const response = await fetch("http://127.0.0.1:8000")
    const result = await response.json()
    setCards(result.cards);
  }

  React.useEffect(() => {
    getData()
  }, [])

  React.useEffect(() => {
    handleChange()
  }, [input])

  React.useEffect(() => {

    if (isFlip) {
      console.log("hehe")
      var temp = Scores 
      temp[currentNumber - 1] = 0
      updateScore(temp);
    }

  }, [isFlip])

  React.useEffect(() => {
    var scores = []
    for (let i = 1; i <= cards.length; i++) {
      scores.push(1)
    }
    updateScore(scores)
  }, [cards])

  const handleNext = () => {
    var temp = Scores 
    temp[currentNumber - 1] = 0
    updateScore(temp)
    if (currentNumber === cards.length) {
      finished()
    }
    arrayRef.current.nextCard()
  }

  return (
    <Stack sx={{ ml: "35%", mt: "10%", mr: "32%" }} spacing={2}>
      <FlashcardArray cards={cards} 
        control={false}
        forwardRef={arrayRef}
        onCardChange={(index) => {
          setCurrentNumber(index)
        }}
        setIsFlipped={(isPlif) => {
            setIsFlip(isPlif)
        }}
      />
      <TextField 
        id="outlined-basic" 
        label="Answer here..." 
        variant="outlined" 
        value={input}
        onChange={(e) => setInput(e.target.value)} />
      <Button onClick={() => handleNext()}>Bỏ qua</Button>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          Kết quả: {totalScore}/{cards.length} từ
        </DialogTitle>
        <DialogContent>
          {wrongs.map((item) => <ul> {item} </ul>)}
        </DialogContent>
        <DialogActions>
          <Button onClick={F5}> Típ tục </Button>
          <Button autoFocus onClick={handleCloseDialog}>
            Khum típ tục
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={openAccepted} autoHideDuration={2000} onClose={handleCloseAccepted} anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}>
          <Alert onClose={handleCloseAccepted} severity="success" sx={{ width: '100%' }}>
            Đúng rồi !
          </Alert>
        </Snackbar>
    </Stack>
  ); 
}

export default App;
