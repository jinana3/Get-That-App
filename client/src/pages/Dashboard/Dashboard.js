import React, { Component } from "react";
//import { Link } from "react-router-dom";
// Component Imports
import Wrapper from "../../components/Wrapper";
import { Row, Container } from "../../components/Grid";
import Nav from "../../components/Nav";
import StatBlock from "../../components/StatBlock";
import UserChart from "../../components/UserChart";
import ItemCard from "../../components/ItemCard";
import SearchPanel from "../../components/SearchPanel";
import Carousel from "../../components/Carousel";
import SavedCard from "../../components/SavedCard";
//import LogoButton from "../../components/LogoButton";
//import SearchItemInput from "../../components/SearchItemInput";
//import SearchItemBtn from "../../components/SearchItemBtn";
//import ShowSearchDisplay from "../../components/ShowSearchDisplayBox";
//import SetBudgetInput from "../../components/SetBudgetInput";

// NPM/External Component Imports
//don't need seperate utils/API...too much work and confusion
import axios from "axios";
//import qp from "query-parse";
import CircularProgressbar from 'react-circular-progressbar';
// CircularProgress Bar CSS
import "./style.css";
// image Imports
import eye from "../../components/images/eye.png";
import budget from "../../components/images/budget.png";
import cart from "../../components/images/cart.png";
import sum from "../../components/images/sum.png";
import defaultProfilePic from "../../components/images/default-profile.png";


// Dummy Data - Discard when done!!!
//let randNum = "$96.45";
let randNum1 = "$1129.63";
let randNum2 = "$343.12";
let randNum3 = "$2396.66";

class Dashboard extends Component {
	state = {
		temp : 100,
		items: [], //this is from website
		purchases: [], //this is from db
		sortedPurchases: [],
		keyword: "", //this is from user
		budget: "", //this is from user
		saved_budget: "",
		username: "Jina" //this is from autho0
	};

 	componentDidMount() {
		this.getSortedResults();
		this.getSavedResults();

	}

	componentDidUpdate(){
		//console.log(this.state);
		this.getSum(this.state.sortedPurchases); //delete this later
	}

	//handling user search to the web////////////////////////////////////
	//this is for search input
	handleInputChange = event => {
		    const { name, value } = event.target;
		    this.setState({
		      [name]: value
		    });
		  };

	//get results from web
	getResults = () => {
		console.log(this.state.keyword)
		axios.get("/api/scrape", {params:{
			keyword: this.state.keyword
		}})
			.then(res =>

				this.setState({
					items: res.data,
					message: !res.data.length
						? "No Items found under this search term"
						: ""
				})
			)
			.catch(err => console.log(err));
	};

	//this is for search button, not working right now
	handleSearch = event => {
		event.preventDefault();
		this.getResults();

	}

	handleSums = () => {
		this.getSum(this.state.sortedPurchases);
	}

	//can save to db
	handlePurchaseSave7 = title => {
		const purchase = this.state.items.find(purchase => purchase.title === title);
		purchase["username"] = this.state.username;
		purchase["units"] = 7;
		purchase["daily_save"] = purchase.price / 7;
		axios.post("/api/purchases", purchase).then(res => this.getSavedResults());
		console.log(purchase);
		console.log(this.state.purchases);
	};

	//can save to db for 14
	handlePurchaseSave14 = title => {
		const purchase = this.state.items.find(purchase => purchase.title === title);
		purchase["username"] = this.state.username;
		purchase["units"] = 14;
		purchase["daily_save"] = purchase.price / 14;
		axios.post("/api/purchases", purchase).then(res => this.getSavedResults());
	};

	//can save to db for 30
	handlePurchaseSave30 = title => {
		const purchase = this.state.items.find(purchase => purchase.title === title);
		purchase["username"] = this.state.username;
		purchase["units"] = 30;
		purchase["daily_save"] = purchase.price / 30;
		axios.post("/api/purchases", purchase).then(res => this.getSavedResults());
		console.log(purchase);
	};

	//get saved purchases for user from db
	getSavedResults = () => {
		console.log(this.state.username);
    axios.get("/api/purchases/" + this.state.username)
      .then(res =>
        this.setState({
          purchases: res.data
        })
      )
      .catch(err => console.log(err));
  };

	getSortedResults = () => {
		axios.get("/api/purchases/sorted/" + this.state.username)
			.then(res =>
				this.setState({
					sortedPurchases: res.data
				})
			)
			.catch(err => console.log(err));
	};



	getSum = array => {
		let priceArray = [];
		for (let value of array) {
  			console.log(value);
				priceArray.push(value.price);
			}
		console.log(priceArray);
		let sum = 0;
		for(let value of priceArray){
			sum = sum + value;
			console.log(sum);
		}
		return(sum);
	};

	//handling budget////////////////////////////////////
	//this is for budget input and saving it into a seperate state value
	handleInputChange_budget = event => {
	    this.setState({
	      budget: event.target.value
	    });
	  };

	// getSaved_budget = () => {
	// 	this.setState({
	// 		saved_budget: this.state.budget
	// 	});
	// }
	//
	// handleSetBudget = event => {
	// 	event.preventDefault();
	// 	this.getSaved_budget();
	// }

	//need something here to handle saving budget input and user profile into db
	//need to save to db

	watchAndCalculate = (value) => {

		// this function should add the item to the db and do the calculation. or contain a seperate function
	   // inside this function that handles the calculation based on the value of which button was pressed.
	   // THIS FUNCTION IS LINKED TO ITEM CARD WHICH IS NESTED INSIDE OF USERCHART.
	   console.log("Watch & Calculate");
	}

	render() {
		return (
		<Wrapper>
			<Nav
				username = {this.state.username}
				userBudget={`$` + this.state.budget}
			/>
			<Container>
				<Row>
					<StatBlock
					title={`Sum of Purchases`}
					amount={'$' + this.getSum(this.state.sortedPurchases)}
					progress={<CircularProgressbar percentage={((200/this.getSum(this.state.sortedPurchases))*100).toFixed(2)} initialAnimation={true}/>}
					icon={cart}
					/>
					<StatBlock
					title={`Purchase Budget`}
					amount={randNum1}
					progress={<CircularProgressbar percentage={this.state.temp} initialAnimation={true}/>}
					icon={budget}
					/>
					<StatBlock
					title={`Sum of Watched`}
					amount={randNum2}
					progress={<CircularProgressbar percentage={87} initialAnimation={true}/>}
					icon={sum}
					/>
					<StatBlock
					title={`Watched Budget`}
					amount={randNum3}
					progress={<CircularProgressbar percentage={46} initialAnimation={true}/>}
					icon={eye}
					/>
				</Row>
				<Row>
					<UserChart
						handleInputChange_budget = {this.handleInputChange_budget}
						handleInputChange = {this.handleInputChange}
						btnName={`Set Budget`}
						userPicture={defaultProfilePic}
						username={this.state.username}
						//handleSetBudget = {this.handleSetBudget} //pushData
						keyword = {this.state.keyword}
						handleSearch = {this.handleSearch}

						showSearch={this.state.items.map(itemcomponent =>
								<ItemCard
										key = {itemcomponent.title}
										id={itemcomponent.title}
										itemImage={itemcomponent.image}
										title={itemcomponent.title}
										price={`$` + itemcomponent.price}
										link = {itemcomponent.link}
										watchAndCalculate={this.watchAndCalculate}
										handlePurchaseSave7 = {this.handlePurchaseSave7}
										handlePurchaseSave14 = {this.handlePurchaseSave14}
										handlePurchaseSave30 = {this.handlePurchaseSave30}
								/>
							)}
					/>
				</Row>

				<Row>
					<SearchPanel
						search={<Carousel
									savedItemCards={
										this.state.purchases.map(saveditem =>
											<SavedCard
												key={saveditem.title}
												id={saveditem.title}
												savedImage={saveditem.image}
												savedprice={`$` + saveditem.price}
												savedTitle={saveditem.title}
												username = {saveditem.username}
											/>
									)}
								/>
						}
					/>
				</Row>
			</Container>
		</Wrapper>
			);
	}
}

export default Dashboard;
