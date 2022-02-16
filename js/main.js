const { Model, Collection, View, Router, Events, history } = Backbone;
//==================================================
//====MODELS+=======================================
//==================================================
const Vehicle = Model.extend({
  idAttribute: 'regNumber',
  urlRoot: '/api/vehicles/',

  defaults: {
    regNumber: null,
  },

  start: function () {
    console.log('Vehicle started...');
  },

  validate: function (attrs) {
    if (!attrs.registrationNumber) {
      return 'Please provide registration number';
    }
  },

  checkValidation: function () {
    const isValid = this.isValid();

    if (!isValid) {
      return console.warn(this.validationError);
    }

    console.log(`The car with reg number ${this.get('regNumber')} is valid. `);
  },
});

const Car = Vehicle.extend({
  defaults: {
    title: 'Car',
    colour: 'white',
  },

  start: function () {
    console.log(`Car with reg num ${this.get('regNumber')} has started...`);
  },
});

const Boat = Vehicle.extend({
  defaults: {
    title: 'Boat',
    material: 'wood',
  },
  start: function () {
    console.log(`Boat with reg num ${this.get('regNumber')} has sailed...`);
  },
});
//==================================================
//====COLLECTION====================================
//==================================================
const Boats = Collection.extend({ model: Boat });
const Cars = Collection.extend({ model: Car });
//==================================================
//====VIEWS++=======================================
//==================================================
const VehicleView = View.extend({
  tagName: 'li',
  className: 'vehicle',
  attributes: {
    'data-material': '',
    'data-colour': '',
  },

  render: function () {
    const source = $('#vehicleTemplate').html();
    const template = _.template(source);
    const html = template(this.model.toJSON());

    this.$el.html(html);
    this.$el.attr('id', this.model.cid);

    return this;
  },
});

const NewVehicleInput = View.extend({
  el: '#inputContainer',

  events: {
    'click #add-new': 'addNew',
  },

  addNew: function () {
    const input = $('#input-new');
    const inputValueNotEmpty = input.val().trim().length;

    if (inputValueNotEmpty) {
      bus.trigger('newVehicleCreated', input.val());
      return input.val('');
    }
    console.log('Enter some value before adding');
  },

  render: function () {
    const source = $('#newVehicleInputTemplate').html();
    const template = _.template(source);

    this.$el.html(template());

    return this;
  },
});

const VehiclesView = View.extend({
  events: {
    'click #btn-delete': 'onDeleteItem',
  },

  initialize: function () {
    bus.on('newVehicleCreated', this.onAddItem, this);
  },

  onDeleteItem: function (event) {
    const elId = event.target.parentElement.id;
    this.$(`li#${elId}`).remove();
  },

  render: function () {
    const self = this;

    this.model.each(function (vehicle) {
      const vehicleView = new VehicleView({ model: vehicle });

      self.$el.append(vehicleView.render().$el);
    });
  },
});

const CarsView = VehiclesView.extend({
  el: '#carsContainer',

  onAddItem: function (data) {
    const newVehicle = new Car({ regNumber: data });
    const newVehicleView = new VehicleView({ model: newVehicle });

    this.model.add(newVehicle, { at: 0 });
    this.$el.prepend(newVehicleView.render().$el);
  },
});

const BoatsView = VehiclesView.extend({
  el: '#boatsContainer',

  onAddItem: function (data) {
    const newVehicle = new Boat({ regNumber: data });
    const newVehicleView = new VehicleView({ model: newVehicle });
    console.log('this.model', this.model);

    this.model.add(newVehicle, { at: 0 });
    this.$el.prepend(newVehicleView.render().$el);
  },
});

//===================================================
//=======PAGES=======================================

const HomePageView = View.extend({
  el: '#container',

  render: function () {
    const source = $('#homePageTemplate').html();
    const template = _.template(source);

    this.$el.html(template());

    return this;
  },
});

const CarsPageView = View.extend({
  el: '#container',

  render: function () {
    const source = $('#carsPageTemplate').html();
    const template = _.template(source);

    this.$el.html(template());

    return this;
  },
});

const BoatsPageView = View.extend({
  el: '#container',
  render: function () {
    const source = $('#boatsPageTemplate').html();
    const template = _.template(source);

    this.$el.html(template);

    return this;
  },
});

const DefaultPageView = View.extend({
  el: '#container',

  render: function () {
    const source = $('#defaultPageTemplate').html();
    const template = _.template(source);

    this.$el.html(template);

    return this;
  },
});

const NavView = View.extend({
  events: {
    click: 'onLinkClick',
  },

  onLinkClick: function (event) {
    const $li = $(event.target);
    appRouter.navigate($li.attr('data-url'), { trigger: true });
  },
});

//==================================================
//====ROUTER+=======================================
//==================================================
const AppRouter = Router.extend({
  routes: {
    '': 'viewHome',
    cars: 'viewCars',
    boats: 'viewBoats',
    '*other': 'viewDefault',
  },

  viewHome: function () {
    const view = new HomePageView();
    view.render();
  },
  viewCars: function () {
    const view = new CarsPageView();
    view.render();

    const carsView = new CarsView({ model: cars });
    const newCarInput = new NewVehicleInput();
    carsView.render();
    newCarInput.render();
  },
  viewBoats: function () {
    const view = new BoatsPageView();
    view.render();

    const boatsView = new BoatsView({ model: boats });
    const newBoatInput = new NewVehicleInput();
    boatsView.render();
    newBoatInput.render();
  },
  viewDefault: function () {
    const view = new DefaultPageView();
    view.render();
  },
});

//==================================================
//====INITIATE======================================
//==================================================
const bus = _.extend({}, Events);

const cars = new Cars([
  new Car({ regNumber: 'XLI887', colour: 'Blue' }),
  new Car({ regNumber: 'ZNP123', colour: 'Blue' }),
  new Car({ regNumber: 'XUV456', colour: 'Gray' }),
]);

const boats = new Boats([
  new Boat({ regNumber: 'XLI87' }),
  new Boat({ regNumber: 'ZNP13' }),
  new Boat({ regNumber: 'XUV46' }),
]);

const appRouter = new AppRouter();
const navView = new NavView({ el: '#nav' });

history.start({ pushState: true });

navView.render();
