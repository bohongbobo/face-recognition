const handleSignin = (db, bcrypt) => (req, res) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
       const isVaild = bcrypt.compareSync(req.body.password, data[0].hash);
       if(isVaild){
           return db.select('*').from('users')
           .where('email', '=', req.body.email)
           .then(user => {
               res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to get the user'))
       } else {
            res.status(400).json('Wrong credential')
       }
    })
    .catch(err => res.status(400).json('wrong credential'))
}

module.exports = {
    handleSignin: handleSignin
};