/**
  * Based on cat_fly_out.js test step 15745. 
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
            'pos': {'x': 363.0621114566315, 'y': 639.9999791613944},
            'prevPos': {'x': 59.99990971114778, 'y': 570.1178422618},
            'velocity': {'x': 303.0622017454837, 'y': -85.71014239681853},
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
            'pos': {'x': 632.9385160728291, 'y': 145.650721255328},
            'prevPos': {'x': 614.0484231673704, 'y': 320.33848727828024},
            'velocity': {'x': 18.890092905458708, 'y': -174.68776602295225},
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
            'pos': {'x': 790.6024949375538, 'y': 29.999957936950665},
            'prevPos': {'x': 970.0000612649901, 'y': 670.00003084093},
            'velocity': {'x': -179.39756632743627, 'y': 893.7907170632008},
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
            'pos': {'x': 192.94597054974616, 'y': 194.84151757079067},
            'prevPos': {'x': 304.48727324178594, 'y': 432.14927382617003},
            'velocity': {'x': -111.54130269203979, 'y': -237.30775625537936},
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