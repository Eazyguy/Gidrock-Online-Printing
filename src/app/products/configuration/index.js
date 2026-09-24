export const DATA = {
    card: {  
    type: "options",    
        
    thickness:{
    "200gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },
    "250gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },
    "300gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },

        "Custom": {}

        },
        
        finishing: {
          gloss:{
            A4:50, 
            A3:100, 
            BussinessCard:10, 
            A5:30, 
            A6:25, 
            custom:null
          }, 
          "star-gloss":{
            A4:100, 
            A3:200, 
            BussinessCard:50, 
            A5:50, 
            A6:40, 
            custom:null
          }, 
          stone:{
            A4:100, 
            A3:200, 
            BussinessCard:50, 
            A5:50, 
            A6:40, 
            custom:null
          }, 
        }
    },

    fliers:{
    type: "options",    

        thickness:{
    "ArtPaper":{ 
            A4:80, 
            A3:160,  
            A5:40, 
            A6:20, 
            custom:null,
        },
    "200gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },
    "250gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },
    "300gsm":{ 
            A4:100, 
            A3:200, 
            BussinessCard:10, 
            A5:50, 
            A6:25, 
            custom:null,
        },
    "Custom":{}

        },


     },
     
    "Banner": {
    type: "measurement",

    pricePerSqFt: 500,

    finishing: [
      "Eyelet",
      "Hemmed",
      "None"
    ]
  },

  "Stickers & Labels": {
    type: "measurement",

    pricePerSqFt: 500,

  },

  "Shirt Printing": {
    type: "shirt",

    shirtType: [
      "Round Neck",
      "Polo",
      "Hoodie"
    ]
  }, 

   "Award": {
    type: "award",

    awardType: [
      "Plaque",
      "Medal",
      "Trophy"
    ]
  },

  "Brochure": {
    type: "brochure",

    size: [
      "A4",
      "A5",
      "A6"
    ],

    pages: [
      4,
      8,
      12,
      16
    ],

    lamination: [
      "Matt",
      "Gloss",
      "None"
    ]
  }
    
}  


