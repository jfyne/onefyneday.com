Vue.component('loading', {
    data: function () {
        return {
            containerStyle: {
                width: '100%',
                height: '100%',
                display: 'flex',
                'align-items': 'center',
                'justify-content': 'center'
            },
            spinnerStyle: {
                height: '1px',
                background: 'black',
                animation: 'expand 5s ease-in-out infinite'
            }
        }
    },
    template: '<div class="loader" v-bind:style="containerStyle"><div v-bind:style="spinnerStyle"></div></div>'
});

var rsvp = new Vue({
    el: '#rsvp',
    data: {
        names: '',
        response: 'yes',
        email: '',
        phone: '',
        number: 1,
        dietary: 'None',
        message: '',
        responded: false,
        loading: false,
        success: false,
        error: false
    },
    methods: {
        onSubmit: async function (message, event) {
            console.log('Form Clicked');
            this.responded = true;
            this.loading = true;
            let collection = firebase.firestore().collection('responses');
            try {
                await collection.doc(this.email).set({
                    names: this.names,
                    response: this.response,
                    email: this.email,
                    phone: this.phone,
                    number: this.number,
                    dietary: this.dietary,
                    message: this.message
                });
            } catch (err) {
                console.log(err);
                this.loading = false;
                this.error = true;
                return;
            }
            this.loading = false;
            this.success = true;
        }
    }
});
