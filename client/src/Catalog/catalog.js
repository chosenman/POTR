import React, { Component } from 'react';
import "./catalog.css";
import Axios from 'axios';

class Catalog extends Component{
    constructor(props){
        super(props);
        this.state = {
            listOfItems: [],
            admin: Boolean
        }

        this.deleteItem = this.deleteItem.bind(this);
    }

    componentDidMount(){
        Axios.get("/items")
        .then((result) =>{
            console.log(result);
            this.setState({
                listOfItems: result.data
            })
            console.log(this.state.listOfItems)
        }).catch((err) =>{
            console.log(err);
        })

        //loading user information:
        //if the user's name is administrator then they have admin access
        Axios.get("/which_user_is_logged_in")
        .then((result) =>{
            console.log("if true they are admin, if false they are not: ", result.data.admin);
            this.setState({
                admin: result.data.admin
            })
        })
        .catch((err) =>{
            console.log(err);
        })
    }

    deleteItem(e){
        this.state.listOfItems.splice(e.target.value, 1)
        this.setState({listOfItems:this.state.listOfItems})
        Axios({
            method: "post",
            url: "/remove_item",
            data: { item_id: e.target.id}
        }).then((result) =>{
            console.log("Was able to remove a item from the list", result)                     
        }).catch((err) =>{
            console.log("there was an error making it to the server..")
        })
    }

    render(){
        let delete_button_header = "";       
        let itemsList = this.state.listOfItems.map((item,index) =>{
            let delete_button = "";
            // only shoing a delete button if they have admin access
            //only deleting items that are not packaged
            if(this.state.admin == true){
                if(item.packaged == false){
                    delete_button = <td><button onClick={this.deleteItem} id={item._id} value={index}> Delete</button></td>
                    delete_button_header = <th></th>
                }
            }

            return(
                <tr key={index}>
                    {delete_button}
                    <td>{item._id}</td>
                    <td>{item.name}</td>
                    <td>{item._package}</td>
                    <td>{item.value}</td>
                    <td>{item.description}</td>
                    <td>{item.donor}</td>
                    <td>{item.restrictions}</td>
                </tr>
            )
        })
        return(
            <div className='table-responsive table-container'>
                <table className='table table-striped table-bordered'>
                    <thead>
                        <tr>
                            {delete_button_header}
                            <th>Item Number</th>
                            <th>Item Name</th>
                            <th>Package</th>
                            <th>Fair Market Value</th>
                            <th>Item Description</th>
                            <th>Donor</th>
                            <th>Item Restriction</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        {itemsList}                        
                    </tbody>
                </table>
            </div>
        )
    }
}

export default Catalog;