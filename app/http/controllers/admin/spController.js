const ServiceProvider = require("../../../models/service_provider");
const Swal = require('sweetalert2')
function spController() {
    return {
        async index(req, res) {
            const service_providerAdded = req.session.service_provideradded;
            req.session.service_provideradded = null;

            const service_providers = await ServiceProvider.find({
               
            })
            //render sp data
            return res.render('admin/service_providers', {
                service_providers: service_providers,
                service_providerAdded
            })
        }, 
        //index of add service_providers
        addServiceProvider(req,res) {
             return res.render('admin/add_service_provider')
             },
        //POST button submit store new service_providers
        async store(req, res) {
            const {
                name,
                address,
            } = req.body;
             //validate request
             if (!name || !address ) {
                 req.flash('error', 'All fields are required!');
                 req.flash('name', name);
                 req.flash('address', address);
                 return res.redirect('/admin/add_service_provider');
             }

             //check if name exists
             ServiceProvider.exists({
                 name: name
             }, (err, result) => {
                 if(result) {
                      req.flash('error', 'Service Provider already exists');
                      req.flash('name', name);
                      req.flash('address', address);
                      return res.redirect('/service_provider/add_service_provider');
                 }
             })
             //create a service_provider
             const service_provider = new ServiceProvider({
                 name,
                 address,
             });

             service_provider
                 .save()
                 .then((service_provider) => {
                     //redirect back to sp list*
                     req.session.service_provideradded = true;
                     return res.redirect('/admin/service_providers');
                 })
                 .catch((err) => {
                     req.flash('error', 'Something went wrong!');
                     return res.redirect('/admin/add_service_provider');
                 });


        },
        //index edit service_provider
         editServiceProvider(req, res) {
            const service_providerEdited = req.session.service_provideredited;
            req.session.service_provideredited = null;
            ServiceProvider.findById(req.params.id, (err, service_provider) => {
                if (err)
                    return console.log(err);

                res.render('admin/edit_service_provider', {
                    id: service_provider._id,
                    name: service_provider.name,
                    address: service_provider.address,
                    service_providerEdited
                });
            });
   
         },
         async edit(req, res) {
             var id = req.params.id;
             const {
                 name,
                 address,
             } = req.body;
             //validate request
             if (!name|| !address) {
                 req.flash('error', 'All fields are required!');
                  req.flash('name', name);
                  req.flash('address', address);
                return res.redirect('/admin/edit_service_provider/' + id);
             }

             //check if sp exists
             ServiceProvider.exists({
                         _id: {
                             '$ne': id
                         },
                 name: name
             }, (err, result) => {
                 if (result) {
                     req.flash('error', 'You cannot edit a Service Provider of the same name');
                      req.flash('address', image);
                      return res.redirect('/admin/edit_service_provider/' + id);

                 } else {
                     ServiceProvider.findById(id, (err, service_provider) => {
                             if (err) {
                                 return console.log(err)
                             }
                             service_provider.name = name;
                             service_provider.address = address;

                             service_provider.save((err) => {
                                 if (err)
                                     return console.log(err);

                                 ServiceProvider.find(function (err, service_providers) {
                                     if (err) {
                                         console.log(err);
                                     } else {
                                         req.app.locals.service_providers = service_providers;
                                     }
                                 });
                             })
                         })
                         .then((service_provider) => {
                             //redirect back to service_provider list*
                             req.flash('success', 'ServiceProvider edited!');
                             req.session.service_provideredited = true;
                             return res.redirect('/admin/edit_service_provider/' + id);
                         })
                         .catch((err) => {
                             req.flash('error', 'Something went wrong!');
                             return res.redirect('/admin/edit_service_provider/' + id);
                         });

                 }
             })
          
             

         },
         //delete service_providers
         delete(req,res) {
             ServiceProvider.findByIdAndRemove(req.params.id, (err) => {
                 if (err)
                     return console.log(err);

                 ServiceProvider.find((err, service_providers) => {
                     if (err) {
                         console.log(err);
                     } else {
                         req.app.locals.service_providers = service_providers;
                     }
                 });

                 res.redirect('/admin/service_providers/');
             });


         }
        }

    }



module.exports = spController;