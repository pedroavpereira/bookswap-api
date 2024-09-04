const User= require('../../../models/User')
const db = require('../../../db/connect')

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })
 

    describe('findById', () => {
        it('should find user detail by user_id', async() => {
            const mockUserData = [
                {user_id: 1, email:'bbb222@yahoo.co.uk' , first_name: 'bbb', last_name:'BBB', password: '1234' , lat: 5.66 , lng: 9.77},
            ]

            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: mockUserData})

            const user = await User.findById(1)

            expect(db.query).toHaveBeenCalledWith("SELECT * FROM users WHERE user_id = $1;", [
      1,
    ])

            expect(user).toBeInstanceOf(User)
        })

        it('should return null if not able to get user detail of user with user_id=1', async() => {
            jest.spyOn(db, 'query').mockResolvedValueOnce({rows: []})
            const user = await User.findById(1)
            await expect(user).toBe(null)
        })
    })

})