import React from 'react';
import './App.css';
import Navigation from './componments/Navigation/Navigation';
import Logo from './componments/Logo/Logo';
import ImageLinkForm from './componments/ImageLinkForm/ImageLinkForm';
import Rank from './componments/Rank/Rank';
import Particles from 'react-particles-js';
import { Component } from 'react';
import FaceRecognition from './componments/FaceRecognition/FaceRecognition';
import Signin from './componments/Signin/Signin';
import Register from './componments/Register/Register'


const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 350
      }
    }
  }
}



const initialState = {
  input: '',
  imgUrl: '',
  box: {},
  route: 'signin',
  isSignedIn: false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}

class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }


  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }
  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response => response.json())
  //   .then(console.log)
  // }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImg');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height),
      leftCol: clarifaiFace.left_col * width
    }
  }

displayFaceBox = (box) => {
  console.log(box);
  this.setState({box: box});
}

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
    fetch('https://warm-shore-01600.herokuapp.com/imageurl', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: this.state.input
      })
    })
      .then(response => response.json())
      .then(response => {
        if(response){
          fetch('https://warm-shore-01600.herokuapp.com/image', {
            method: 'put',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, { entries: count}))
          })
          .catch(console.log)
          }
          this.displayFaceBox(this.calculateFaceLocation(response))
        })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState)
    } else if(route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }
  
  render(){
    const { isSignedIn, imgUrl, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit} />
            <FaceRecognition box={box} imgUrl={imgUrl} />
          </div>
          : (
            route === 'signin'
              ? <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
          )
        }
      </div>
    );
  }
}

export default App;
