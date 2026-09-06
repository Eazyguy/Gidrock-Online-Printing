import { CursorArrowRaysIcon, ArrowUpOnSquareStackIcon,
    CreditCardIcon,
    InboxStackIcon,
    SparklesIcon,ClockIcon, TruckIcon, ShieldCheckIcon
 } from "@heroicons/react/24/outline"

export const navLinks = {

}

export const services = [
    {   title: "Card", 
        description: "Printing of Bussiness Cards, Contribution card, complimentary card, invitation cards etc",
        image: "/business_cards.png"
     }, 

    {   title: "Fliers and posters", 
        description: "Printing of all kinds of fliers for churches and bussinesses",
        image:"/fliers_and_posters.png"
     }, 

    {   title: "Banners", 
        description: "Printing of Banners for bussinesses, bill boards and so on",
        image: "/banners.png"
     }, 

    {   title: "Stickers & Labels",
         description: "Printing of Church stickers, emblems, for companies etc.",
        image:"/stickers_and_labels.png"
        }, 

    {   title: "Bronchures",
        description: "Printing of Bronchure manuals for occassions and bussinesses",
        image:"/brochures.png"
    }, 

    {   title: "Shirt Printing",
        description: "We also print on shirts and school uniforms",
        image: "/shirt_printing.png"
    }, 

    {   title: "Award", 
        description: "We do all kinds of Awards for all occassions",
        image:"/awards.png" 
     }, 
]
    
export const howItWorks = [
    {
        title: "1. Choose",
        description: "Pick a product and configure size, quantity and finishing",
        icon:<CursorArrowRaysIcon className="text-green-800 h-13 w-15 mb-2"/>
    },

    {
        title: "2.  Upload",
        description: "Send us your artwork or request our free design help.",
        icon:<ArrowUpOnSquareStackIcon className="text-green-800 h-13 w-15 mb-2"/>
    },

    {
        title: "3. Approve & pay",
        description: "Confirm the proof and pay securely online.",
        icon:<CreditCardIcon className="text-green-800 h-15 w-15 mb-2"/>
    },

    {
        title: "4. Delivered",
        description: "We print, quality-check and ship to your doorstep.",
        icon:<InboxStackIcon className="text-green-800 h-15 w-15 mb-2"/>
    },
]

export const whyChooseUs = [
    {
        title: "Professional finishing",
        description: "Foil, spot UV, lamination, embossing — done in-house.",
        icon:<SparklesIcon className="text-green-800 h-13 w-15 mb-2"/>
    },

    {
        title: "Fast turnaround",
        description: "Same-day for stickers, 48–72hr for most orders.",
        icon:<ClockIcon className="text-green-800 h-13 w-15 mb-2"/>
    },

    {
        title: "Delivered nationwide",
        description: "Reliable courier partners covering all 36 states.",
        icon:<TruckIcon className="text-green-800 h-15 w-15 mb-2"/>
    },

    {
        title: "Quality guarantee",
        description: "Not happy with your print? We reprint free.",
        icon:<ShieldCheckIcon className="text-green-800 h-15 w-15 mb-2"/>
    },
]

export const testimony = [
    {
        name: "Adaeze O.",
        Occupation: "Event planner, Lagos",
        content: `"Our wedding invites came out stunning. The gold foil was flawless and delivery was two days early."`
    },
     {
        name: "Musa I.",
        Occupation: "Founder, Kano",
        content: `"Ordered 500 flyers on Monday, they were at my office Wednesday. Colours were vivid — clients loved them."`
    },
    {
        name: "Chidera N.",
        Occupation: "Brand designer",
        content: `"The upload flow is dead simple and pricing is transparent. Gidrock is now my go-to print partner."`
    },
]