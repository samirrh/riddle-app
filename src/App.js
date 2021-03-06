import React, { Component } from "react"
import "./App.css"
import axios from "axios"
import Table from "react-bootstrap/lib/Table"
import "font-awesome/css/font-awesome.css"

class App extends Component {
  state = {
    names: [],
    rank: [],
    completionTime: [],
    points: [],
    current: true,
    oldRiddleData: []
  }
  componentWillMount(){
     //console.log('run');
     //request to get data
     axios.get('/leaderboard').then((res)=>{
      return res.data;
    }).then((riddleAnswers)=>{
      const week1=riddleAnswers[0].info;
      const length=week1.length;
      //sorting based on points, then completion time
      for(let i=0;i<length;i++){
        for(let j=0;j<length-1;j++){
          if(week1[j]['Total points']<week1[j+1]['Total points']){
            let temp=week1[j];
            week1[j]=week1[j+1];
            week1[j+1]=temp;
          }
          else if(week1[j]['Total points']==week1[j+1]['Total points']&&week1[j]['Completion time']>week1[j+1]['Completion time']){
            let temp=week1[j];
            week1[j]=week1[j+1];
            week1[j+1]=temp;
          }
        }
      }
      //gets array with only the names
      const names= week1.map((value)=>{
        return value.Name;
      });
      //get array with completion time
      const completionTime= week1.map((value)=>{
        return value['Completion time'];
      });
      //gets array with total points
      const points= week1.map((value)=>{
        return value['Total points'];
      });
      this.setState({
        names:names,
        completionTime:completionTime,
        points:points
      });
      
    });

    axios.get('/oldRiddles').then((res)=>{
      return res.data;
    }).then((previousRiddle)=>{
      const number = previousRiddle[0].number;
      const answer = previousRiddle[0].answer;
      const question = previousRiddle[0].question;
      const newLink = previousRiddle[0].link;
      this.setState({
        oldRiddleData: [number,answer,question,newLink]
      });
    });
  }


  changeTable(value) {
    if (this.state.current !== value) {
      this.setState({ current: value })
    }
  }

  render() {
    const { names, completionTime, points, rank, current, oldRiddleData } = this.state;
    const data= names.map((value,index)=>{
      return (<tr>
        <td>{index+1}</td>
        <td>{value}</td>
        <td>{points[index]}</td>
        <td>{completionTime[index]}</td>
      </tr>)
    })
    return (
      <div className="appContainer">
        <div className="innerContainer">
        <div className="Leaderboard">
          <div>
            <h1>Leaderboard</h1>
          </div>
          <div>
            <Table striped bordered condensed hover className="color-black">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Points</th>
                  <th>Completion time</th>
                </tr>
              </thead>

              <tbody>
                {data}
              </tbody>

            </Table>
            </div>           
          </div>
        </div>
        <div className="innerContainer">
        <div className="quiz">
          <div>
            <h1>Answer to the Previous Riddle</h1>
            <h2>Riddle #{oldRiddleData[0]}</h2>
            <h3>Question: {oldRiddleData[1]}</h3>
            <h3>Answer: {oldRiddleData[2]}</h3>
          </div>
        </div>
        </div>
      </div>
    )
  }
}

export default App
