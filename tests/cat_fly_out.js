/**
  * Based on unknown test step 1332. 
  */
var environ =
{   
    'reductor': 1,

    'images':
    {
        0: {'url': '/img/green_crazy_cat.png'}, 
        1: {'url': '/img/tapok.png', 'width': 60, 'height': 60}
    },

    'bodies':
    {
        0: {
            'id': 'cat',
            'mass': 60,
            'pos': {'x': 123.819701657032, 'y': 74.32296039936534},
            'prevPos': {'x': 60, 'y': 80.62193857807128},
            'velocity': {'x': 63.819701657032006, 'y': -6.2989781787059425},
            'behaviours':
            {
                'attracts': [1, 2, 3],
                'collides': [1, 2, 3],
                'boundbox': true
            },
            'imageKey': 0
        },

        1: {
            'id': 'tapok-1',
            'mass': 30,
            'pos': {'x': 247.0822784612432, 'y': 62.0542023174369},
            'prevPos': {'x': 313.8267504676634, 'y': 149.30033384579906},
            'velocity': {'x': -66.74447200642018, 'y': -87.24613152836216},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [0, 2, 3],
                'boundbox': true
            },
            'imageKey': 1
        },

        2: {
            'id': 'tapok-2',
            'mass': 30,
            'pos': {'x': 438.45262484437586, 'y': 412.80258919925205},
            'prevPos': {'x': 470.3107514415467, 'y': 370.4698443934614},
            'velocity': {'x': -31.85812659717083, 'y': 42.33274480579062},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [0, 1, 3],
                'boundbox': true
            },
            'imageKey': 1
        },

        3: {
            'id': 'tapok-3',
            'mass': 30,
            'pos': {'x': 392.32158718322034, 'y': 62.664266345232505},
            'prevPos': {'x': 378.89032135591515, 'y': 54.44187610781006},
            'velocity': {'x': 13.431265827305179, 'y': 8.222390237422447},
            'behaviours': 
            {
                'attracts': [0],
                'collides': [0, 1, 2],
                'boundbox': true
            },
            'imageKey': 1
        }
    },
};