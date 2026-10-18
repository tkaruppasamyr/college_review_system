const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    aishe_code: { 
        type: String, 
        required: [true, 'AISHE code is required'], 
        unique: true, 
        uppercase: true,
        minlength: [4, 'AISHE code must be at least 6 characters (e.g., U-1234)'],
        maxlength: [8, 'AISHE code cannot exceed 8 characters'],
        // validate: {
        //     validator: function(v:any) {
        //         return /^[CUS]-\d{4,6}$/.test(v);
        //     },
        //     message: (props:any) => `${props.value} is not a valid AISHE code! Format must be like C-12345.`
        // }
    },
    college_name: { type: String, required: [true, 'College name is required'],index: true },
    clg_loc_name: String,
    city: String,
    state: String,
    country:  String,
    create_at: { type: Date, default: Date.now },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false }
})

// export const CollegeDb = mongoose.model('college', collegeSchema);
export const CollegeDb =mongoose.models.college || mongoose.model('college', collegeSchema);



class CollegeService {

    async get_aishe_by(aishe_code: string) {
        try{
            const college = await CollegeDb.findOne({ aishe_code: aishe_code });
            return college;
        }           
        catch (error) {
            return null;
        }
    }

    async create_clg(clg: any) {
        try{
            const result = await CollegeDb.create(clg);
            return result;
        }           
        catch (error) {
            console.log(error);
            return null;
        }
    }

    async getPaginatedColleges(page: number, limit: number) {
        const skipIndex = (page - 1) * limit;

        const [colleges, totalDocuments] = await Promise.all([
            CollegeDb.find({})
                .sort({ _id: -1 }) 
                .skip(skipIndex)
                .limit(limit)
                .lean(),
            
            CollegeDb.countDocuments()
        ]);

        return {
            colleges,
            totalDocuments,
            totalPages: Math.ceil(totalDocuments / limit),
            currentPage: page
        };
    }

   


    async getCollegeRatings(search: string, page: number, limit: number) {
        const skip = (page - 1) * limit;

        const matchStage: any = {
        is_deleted: false,
        is_active: true,
        };

        if (search.trim()) {
        matchStage.$or = [
            { college_name: { $regex: search, $options: 'i' } },
            { city: { $regex: search, $options: 'i' } },
            { state: { $regex: search, $options: 'i' } },
            { aishe_code: { $regex: search, $options: 'i' } },
        ];
        }

        const pipeline = [
        { $match: matchStage },
        {
            $lookup: {
            from: 'ratings', 
            localField: '_id',
            foreignField: 'college_id',
            as: 'ratings',
            },
        },
        
        {
            $project: {
            _id: 1,
            aishe_code: 1,
            college_name: 1,
            city: 1,
            state: 1,
            review_count: { $size: '$ratings' },
            average_rating: {
                $cond: [
                { $gt: [{ $size: '$ratings' }, 0] },
                { $avg: '$ratings.overall_rating' },
                0,
                ],
            },
            },
        },
        
        {
            $facet: {
            metadata: [{ $count: 'total' }],
            data: [{ $skip: skip }, { $limit: limit }],
            },
        },
        ];

        const [result] = await CollegeDb.aggregate(pipeline);

        const totalDocuments = result.metadata[0] ? result.metadata[0].total : 0;
        const totalPages = Math.ceil(totalDocuments / limit);

        return {
        colleges: result.data,
        totalDocuments,
        currentPage: page,
        totalPages,
        };
    }


}

export const collegeservice = new CollegeService();