//Require the express package and use express.Router()
const express = require('express');
const router = express.Router();
const companieslist = require('../models/List');


//GET HTTP method to /companieslist
router.get('/',(req,res) => {
    companieslist.getAllCompanies((err, lists)=> {
    if(err) {
        res.json({success:false, message: `Failed to load all lists. Error: ${err}`});
    }
    else {
        res.write(JSON.stringify({success: true, lists:lists},null,5));
res.end();

}
});
});


//POST HTTP method to /companieslist

router.post('/', (req,res,next) => {
    console.log(req.body);
    let parentCompany;
    if (req.body.parentCompany) {
        companieslist.findParentCompany(req.body.parentCompany, (err, company) => {
            if(err) {
                res.json({success: false, message: `Failed to find a parent company. Error: ${err}`});   
            }
            else {
                parentCompany = company;
                // company.getSiblings((err, docs) => console.log(docs));
                // company.getAncestors((err, docs) => console.log(docs));
                // company.getChildren((err, docs) => console.log(docs));
                company.getTree((err, docs) => console.log(docs));
                console.log(company);
                let newCompany = new companieslist({
                    name: req.body.name,
                    EstimatedEarnings: req.body.EstimatedEarnings,
                    EstimatedEarningsAllChild: 25
                });
                companieslist.addChildCopany(company._id, newCompany,(err, list) => {
                    if(err) {
                        res.json({success: false, message: `Failed to create a new list. Error: ${err}`});
                
                    }
                    else
                        res.json({success:true, message: "Added successfully."});
                
                });
            }
        });
    }
    // let newCompany = new companieslist({
    //     name: req.body.name,
    //     EstimatedEarnings: req.body.EstimatedEarnings,
    // });

// companieslist.addList(newList,(err, list) => {
//     if(err) {
//         res.json({success: false, message: `Failed to create a new list. Error: ${err}`});

//     }
//     else
//         res.json({success:true, message: "Added successfully."});

// });
});


//DELETE HTTP method to /companieslist. Here, we pass in a params which is the object id.
router.delete('/:id', (req,res,next)=> {
    let id = req.params.id;
console.log(id);
companieslist.deleteListById(id,(err,list) => {
    if(err) {
        res.json({success:false, message: `Failed to delete the list. Error: ${err}`});
    }
    else if(list) {
        res.json({success:true, message: "Deleted successfully"});
    }
    else
        res.json({success:false});
})
});

module.exports = router;