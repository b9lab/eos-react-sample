import React, { Component } from 'react';
import Eos from "eosjs";

import {EosContext} from "./eos-context.js"

import SurveyAnswerList from "./SurveyAnswerList.js"

export default class SurveyList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eos: props.props.eos,
      surveys: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  updateSurveys() {

    this.state.eos.getTableRows({
      code:'survey',
      scope:'survey',
      table:'sur',
      json:true
    }).then((res) => {
      this.setState({ surveys: res.rows, eos:this.state.eos});
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    let surveyNumber = event.target.surveyNumber.value;
    let question = event.target.question.value;

    this.state.eos.contract('survey').then(survey => {
      survey.createsurvey(
        {surveyNumber:surveyNumber, question:question},
        { scope: "survey", authorization: [{
            actor: "survey",
            permission: 'active',
          }]
        })
      .then((e) => {
        console.log(e);
        this.updateSurveys(); 
      })
    })
  }

  componentDidMount() { 
    this.updateSurveys();   
  }

  render() {
    return (
      <div>
        <b>Survey data - {this.state.surveys.length} entries</b>
        <SurveyTable data={this.state.surveys}/>
        <SurveyForm self={this}></SurveyForm>
      </div>
    )
  }  

}

const SurveyForm = ({survey, self}) => (
  <form onSubmit={self.handleSubmit}>
    <div className="survey-form-table">
      <div className="survey-form-row survey-form-row">
      <span className="table-field">
          <input type="text" name="surveyNumber"/>
        </span>
        <span className="table-field">
          <input type="text" name="question"/>
        </span>
        <span className="table-field">
          <input type="submit" value="save survey"/>
        </span>
      </div>
    </div>
  </form>
)

const SurveyTableRow = ({survey}) => (
  <div className="survey-row">
    <span className="table-field">{survey.surveyNumber}</span>
    <span className="table-field">{survey.question}</span>
    <div className="survey-answers-box">
      <EosContext.Consumer>
        {eos => (
          <SurveyAnswerList props={{eos:eos, survey:survey}} />
        )}
      </EosContext.Consumer>
    </div>
  </div>
)

const SurveyTable = ({data}) => (
  <div>
    <div className="survey-table">
      <div className="survey-row header-row">
        <span className="table-field">Number</span><span className="table-field">Question</span>
      </div>
      {data.map((survey) => 
        <SurveyTableRow survey={survey} key={survey.surveyNumber} />
      )}
    </div>
  </div>
)



