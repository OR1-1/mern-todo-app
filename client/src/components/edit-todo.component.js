import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';


export default class EditTodo extends Component {
  constructor(props) {
    super(props);

    // bind event handlers
    this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
    this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
    this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
    this.onChangeTodoCompleted = this.onChangeTodoCompleted.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      todo_description: '',
      todo_responsible: '',
      todo_priority: '',
      todo_completed: false,
      to_main: false
    }
  }

  // life cycle method
  componentDidMount() {
    axios.get('http://localhost:4000/api/v1/todos/' + this.props.match.params.id)
    .then(response => {
      this.setState({
        todo_description: response.data.todo_description,
        todo_responsible: response.data.todo_responsible,
        todo_priority: response.data.todo_priority,
        todo_completed: response.data.todo_completed
      })
    })
    .catch(function (error) {
      console.log(error);
    })
  }

  // event handlers
  onChangeTodoDescription(e) {
    this.setState({
      todo_description: e.target.value
    });
  }

  onChangeTodoResponsible(e) {
    this.setState({
      todo_responsible: e.target.value
    });
  }

  onChangeTodoPriority(e) {
    this.setState({
      todo_priority: e.target.value
    });
  }

  onChangeTodoCompleted(e) {
    this.setState({
      todo_completed: !this.state.todo_completed
    });
  }

  onSubmit(e) {
    e.preventDefault();

    console.log(`Form submitted:`);
    console.log(`Todo Description: ${this.state.todo_description}`);
    console.log(`Todo Responsible: ${this.state.todo_responsible}`);
    console.log(`Todo Completed: ${this.state.todo_completed}`);
    console.log(`Todo Priority: ${this.state.todo_priority}`);

    const selectedTodo = {
      todo_description: this.state.todo_description,
      todo_responsible: this.state.todo_responsible,
      todo_priority: this.state.todo_priority,
      todo_completed: this.state.todo_completed
    };

    axios.post('http://localhost:4000/api/v1/todos/update/' + this.props.match.params.id, selectedTodo)
    .then(res => console.log(res.data))
    .then(() => this.setState(() => ({
      to_main: true
    })))

    // this.props.history.push("/");
  }

  // output
  render() {
    if (this.state.to_main === true) {
      return <Redirect to='/' />
    }
    return (
      <div style={{marginTop: 10}}>
        <h3>Create New Todo</h3>
        <form onSubmit={this.onSubmit}>
          <div className="form-group">
            <label>Description: </label>
            <input type="text"
              className="form-control"
              value={this.state.todo_description}
              onChange={this.onChangeTodoDescription}
            />
          </div>
          <div className="form-group">
            <label>Responsible: </label>
            <input type="text"
              className="form-control"
              value={this.state.todo_responsible}
              onChange={this.onChangeTodoResponsible}
            />
          </div>
          <div className="form-group">
            <div className="form-check form-check-inline">
              <input type="radio"
                className="form-check-input"
                name="priorityOptions"
                id="priorityLow"
                value="Low"
                checked={this.state.todo_priority==='Low'}
                onChange={this.onChangeTodoPriority}
              />
              <label className="form-check-label">Low</label>
            </div>
            <div className="form-check form-check-inline">
              <input type="radio"
                className="form-check-input"
                name="priorityOptions"
                id="priorityMedium"
                value="Medium"
                checked={this.state.todo_priority==='Medium'}
                onChange={this.onChangeTodoPriority}
              />
              <label className="form-check-label">Medium</label>
            </div>
            <div className="form-check form-check-inline">
              <input type="radio"
                className="form-check-input"
                name="priorityOptions"
                id="priorityHigh"
                value="High"
                checked={this.state.todo_priority==='High'}
                onChange={this.onChangeTodoPriority}
              />
              <label className="form-check-label">High</label>
            </div>
          </div>
          <div className="form-check">
            <input  className="form-check-input"
              id="completedCheckbox"
              type="checkbox"
              name="completedCheckbox"
              onChange={this.onChangeTodoCompleted}
              checked={this.state.todo_completed}
              value={this.state.todo_completed}
            />
            <label className="form-check-label" htmlFor="completedCheckbox">
              Completed
            </label>
          </div>
          <br />
          <div className="form-group">
            <input type="submit" value="Update Todo" className="btn btn-primary" />
          </div>
        </form>
      </div>
    )
  }
}
