/**
  * Based on master test (but from index.html, not unit-test version) step 1332. 
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
            'pos': {'x': 99.57035224669922, 'y': 538.1681722968362},
            'prevPos': {'x': 90.01355470913511, 'y': 539.626416012626},
            'velocity': {'x': -8.614386317836964, 'y': 42.17046732173609},
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
            'pos': {'x': 321.2006282880118, 'y': 175.052486353445},
            'prevPos': {'x': 309.09202110801766, 'y': 169.68766201821745},
            'velocity': {'x': 12.108607179994113, 'y': 5.364824335227559},
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
            'pos': {'x': 290.8315405049166, 'y': 358.8754395546239},
            'prevPos': {'x': 262.372509346836, 'y': 395.70053989764455},
            'velocity': {'x': 28.45903115808055, 'y': -36.825100343020665},
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
            'pos': {'x': 64.96704942320858, 'y': 621.2501284227352},
            'prevPos': {'x': 145.22779809436526, 'y': 587.6424588677806},
            'velocity': {'x': -50.052718337408876, 'y': -38.921310225972796},
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