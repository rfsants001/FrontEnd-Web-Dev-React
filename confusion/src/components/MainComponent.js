import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux'; 
import { actions } from 'react-redux-form'; 
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { postComment, fetchDishes, fetchComments, fetchPromos } from '../redux/ActionCreators';

import Header from './HeaderComponent';
import Home from './HomeComponent';
import About from './AboutComponent';
import Menu from './MenuComponent';
import DishDetail from './DishdetailComponent';
import Contact from './ContactComponent';
import Footer from './FooterComponent';


const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        promotions: state.promotions,
        leaders: state.leaders
    }
}

const mapDispatchToProps = (dispatch) => ({
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment)),
    fetchDishes: () => {dispatch(fetchDishes())},
    resetFeedbackForm: () => {dispatch(actions.reset('feedback'))},
    fetchComments: () => {dispatch(fetchComments())},
    fetchPromos: () => {dispatch(fetchPromos())},
});

class Main extends Component {


    componentDidMount() {
        this.props.fetchDishes();
        this.props.fetchComments();
        this.props.fetchPromos();
    }

  render() {
    const HomePage = () => {
        return(
            <Home 
                dish={this.props.dishes.dishes.filter((dish) => dish.featured)[0]}
                dishesLoading={this.props.dishes.isLoading}
                dishesErrMess={this.props.dishes.errMess}
                promotion={this.props.promotions.promotions.filter((promo) => promo.featured)[0]}
                promosLoading={this.props.promotions.isLoading}
                promossErrMess={this.props.promotions.errMess}
                leader={this.props.leaders.filter((leader) => leader.featured)[0]}
            />
        );
    }

    const DishWithId = ({match}) => {
        return (
            <DishDetail 
                dish ={this.props.dishes.dishes.filter((dish) => dish.id === parseInt(match.params.dishId, 10))[0]}
                isLoading={this.props.dishes.isLoading}
                errMess={this.props.dishes.errMess}
                comments = {this.props.comments.comments.filter((comment) => comment.dishId === parseInt(match.params.dishId, 10))}
                commentsErrMess={this.props.comments.errMess}
                postComment = {this.props.postComment}
            />
        );
    }


    return (
        <div>
            <Header/>
            <TransitionGroup>
                <CSSTransition key={this.props.location.key} classNames="page" timeout={300}>
                    <Switch>
                        <Route path="/home" component={HomePage} />
                        <Route path="/aboutus" component={() => <About leaders={this.props.leaders} />} />
                        <Route exact path="/menu" component={() => <Menu dishes={this.props.dishes} /> } />
                        <Route path="/menu/:dishId" component={DishWithId} />
                        <Route exact path="/contactus" component={() => <Contact resetFeedbackForm={this.props.resetFeedbackForm} />} />
                        <Redirect to="/home" />
                    </Switch>
                </CSSTransition>
            </TransitionGroup>
            <Footer/>
        </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Main));