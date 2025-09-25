import { Router } from "express";
import { Request,Response,NextFunction } from "express";
import OwnerModel from "../models/Owner";
import CustomerModel from "../models/Customer";
import VehicalModel from "../models/Vehicals";
const router = Router()


//admin login
router.post('/login',async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const {email,password} = req.body;
        if(email === "admin@gmail.com"&& password==="admin123"){
            return res.status(200).json({
                success:true,
                message:"successfully login"
            })
        }else{
            return res.status(400).json({
                success:false,
                message:"Invalid credentials"
            })
        }

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }
})


//jget the coustomers
router.get('/users',async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const users = await CustomerModel.find().exec()
        if(users.length === 0){
            return res.status(404).json({
                success:false,
                message:"no user founds"
            })
        }else{
            return res.status(200).json({
                success:true,
                message:"All Users",
                users:users
            })
        }


    }catch(error){
        console.log(error)
    }
})


//get the owners 
router.get('/owners',async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const Owners = await OwnerModel.find().exec()
        if(Owners.length === 0){
            return res.status(404).json({
                success:false,
                message:"no owers found"
            })
        }else{
            return res.status(200).json({
                success:true,
                Owners:Owners
            })
        }

    }catch(error){
        console.log(error)
    }
})


router.get('/ordes',async(req:Request,res:Response,next:NextFunction)=>{
    try{
        

    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:"internal server error"
        })
    }

})


//view vehicals
router.get('/vehicles', async (req: Request, res: Response, next: NextFunction) => {
    const { type, place } = req.query as { type: string; place: string }; // Assuming 'type' and 'place' are passed as query parameters
  
    try {
      const vehicles: any[] = await VehicalModel.find({ vehicalType: type, city: { $regex: new RegExp(place, 'i') }  }).exec();
  
      if (!vehicles || vehicles.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'No vehicles found for the specified type and place',
        });
      }
  
      return res.status(200).json({
        success: true,
        vehicles,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  });





export default router