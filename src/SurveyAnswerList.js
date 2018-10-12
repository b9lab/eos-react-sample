import React, { Component } from 'react';
import Eos from "eosjs";

export default class SurveyAnswerList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eos: props.props.eos,
      survey: props.props.survey,
      answers: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  updateAnswerList() {
    this.state.eos.getTableRows({
      code:'survey',
      scope:this.state.survey.surveyNumber,
      table:'res',
      json:true
    }).then((res) => {
      console.log(res);
      this.setState({ eos: this.state.eos, survey: this.state.survey, answers: res.rows });
    });
  }

  componentDidMount() {
    this.updateAnswerList();
  }

  render() {
    return (
      <div>
        <SurveyAnswerTable data={this.state.answers} />
        <AnswerForm survey={this.state.survey} handler={this.handleSubmit}/>
      </div>
    )
  }

  handleSubmit(event) {
    event.preventDefault();

    let who = event.target.who.value;
    let response = event.target.response.value;
    let surveyNumber = event.target.surveyNumber.value;

    this.state.eos.contract('survey').then(survey => {
      survey.answer(
        {who:who, surveyNumber:surveyNumber, responseStr:response},
        { scope: surveyNumber, authorization: [{
            actor: "user",
            permission: 'active',
          }]
        }).then(() => {
          this.updateAnswerList();
        })
    })
  }
}

const SurveyAnswerTableRow = ({answer}) => {
  return(
  <div className="survey-row">
    <span className="table-field">{answer.who}</span>
    <span className="table-field">{answer.response}</span>
  </div>
)
}

const SurveyAnswerTable = ({data}) => (
  <div>
    <b>Answers ({data.length})</b>
    <div className="survey-answer-table">
      <div className="survey-row header-row">
        <span className="table-field">Who</span><span className="table-field">Response</span>
      </div>
        {data.map((answer,i) => 
          <SurveyAnswerTableRow answer={answer} key={i}/>
        )}
    </div>
  </div>
)



const AnswerForm = ({survey, handler}) => (
  <form onSubmit={handler}>
    <div className="survey-form-table">
      <div className="survey-form-row">
        <span className="table-field">
          <input type="text" name="who"/>
        </span>
        <span className="table-field">
          <input type="text" name="response"/>
        </span>
        <span className="table-field">
          <input type="hidden" value={survey.surveyNumber} name="surveyNumber"/>
          <input type="submit" value="save answer"/>
        </span>
      </div>
    </div>
  </form>
)