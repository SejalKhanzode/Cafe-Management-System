const Cafe = require("../models/Cafe");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.registerCafe = async (req, res) => {
  try {
    const userId = req.user.id;
    let { cafeName, subTitle, address, city } = req.body;
    const profile = req.files.profile;

    if (!cafeName || !subTitle || !address || !city || !profile) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }

    const profileImage = await uploadImageToCloudinary(
      profile,
      process.env.FOLDER_NAME
    );
    console.log(profileImage);

    let cafeOwnerDetails = await User.findById(userId);
    console.log("cafeownerdeatils>>", cafeOwnerDetails);
    if (!cafeOwnerDetails) {
      return res.status(404).json({
        success: false,
        message: "Cafe owner Details Not Found",
      });
    }

    const newCafe = await Cafe.create({
      cafeName,
      subTitle,
      city,
      address,
      profile: profileImage.secure_url,
      owner: cafeOwnerDetails._id,
    });

    const updatedUser = await User.findByIdAndUpdate(
        {_id:cafeOwnerDetails._id},
        {
            $push:{
                cafes:newCafe._id
            }
        },
        {new:true}
    )
    console.log("updatedUser", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Cafe Registred successfully",
      newCafe,
    });
  } catch (error) {
    console.log("error>>>>", error);
    return res.status(400).json({
      success: false,
      message: "Cafe cannot registered",
    });
  }
};

exports.getAllCafes = async(req, res)=>{
    try{
        const {city} = req.body;
        const allCafes = await Cafe.find({city});

        return res.status(200).json({
            success:true,
            allCafes,
            message:'All cafes fetched successfully'
        })
    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:'error in fetching all cafes'
        })
    }
};

exports.getCafeDetails = async(req, res)=>{
    try{
        const {cafeId} = req.body;

        const cafeDetails = await Cafe.find(
            {_id:cafeId}
        ).populate("dishes");

              if(!cafeDetails) {
                return res.status(400).json({
                    success:false,
                    message:`Could not find the Cafe with ${cafeId}`,
                });
             }
            return res.status(200).json({
                success:true,
                message:"Cafe Details fetched successfully",
                data:cafeDetails,
            })


    }catch(error){
        console.log(error);
        return res.status(400).json({
            success:false,
            message:'error in fetching all cafe details'
        })
    }
}