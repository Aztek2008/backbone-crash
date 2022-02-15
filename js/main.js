const { Model, Collection, View, Router, history } = Backbone;
//==================================================
//====MODELS+=======================================
//==================================================
const Vehicle = Model.extend({
  idAttribute: 'regNumber',
  urlRoot: '/api/vehicles/',

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
    regNumber: null,
    colour: 'white',
  },

  start: function () {
    console.log(`Car with reg num ${this.get('regNumber')} has started...`);
  },
});

const Boat = Vehicle.extend({
  defaults: {
    regNumber: null,
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
const BoatView = View.extend({
  tagName: 'li',
  className: 'vehicle',
  attributes: {
    'data-material': '',
  },

  render: function () {
    const source = $('#boatTemplate');
    const template = _.template(source);
    const html = template(this.model.toJSON());

    this.$el.html(html);
    this.$el.attr('id', this.model.cid);

    return this;
  },
});

const CarView = View.extend({
  tagName: 'li',
  className: 'vehicle',
  attributes: {
    'data-colour': '',
  },

  render: function () {
    const source = $('#carTemplate').html();
    const template = _.template(source);
    const html = template(this.model.toJSON());

    console.log('html', html);

    this.$el.html(html);
    this.$el.attr('id', this.model.cid);

    return this;
  },
});

const CarsView = View.extend({
  el: $('#carsContainer'),

  render: function () {
    const self = this;
    console.log('this.model', this.model);

    this.model.each(function (car) {
      const carView = new CarView({ model: car });
      console.log('carView', carView.render().$el);

      self.$el.append(carView.render().$el);
    });
  },
});

const HomePageView = View.extend({
  el: '#container',
  render: function () {
    this.$el.html('HOME VIEW');

    return this;
  },
});

const CarsPageView = View.extend({
  el: '#container',

  initialize: function () {
    const carsView = new CarsView({ el: '#carsContainer', model: cars });
    console.log('carsView', carsView);
    console.log('cars', cars);

    carsView.render();
    console.log('carsView.render()', carsView.render());
    this.render();
  },

  render: function () {
    const source = $('#carsPageTemplate').html();
    const template = _.template(source);

    this.$el.html(template);

    return this;
  },
});

const BoatsPageView = View.extend({
  el: '#container',
  render: function () {
    this.$el.html('BOATS VIEW');

    return this;
  },
});

const DefaultPageView = View.extend({
  el: '#container',
  render: function () {
    this.$el.html('PAGE NOT FOUND');

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
  },
  viewBoats: function () {
    const view = new BoatsPageView();
    view.render();
  },
  viewDefault: function () {
    const view = new DefaultPageView();
    view.render();
  },
});

//==================================================
//====INITIATE======================================
//==================================================
const cars = new Cars([
  new Car({ regNumber: 'XLI887', colour: 'Blue' }),
  new Car({ regNumber: 'ZNP123', colour: 'Blue' }),
  new Car({ regNumber: 'XUV456', colour: 'Gray' }),
]);

const appRouter = new AppRouter();
const navView = new NavView({ el: '#nav' });
// const carsView = new CarsView({ model: cars });

history.start({ pushState: true });

navView.render();
// carsView.render();
