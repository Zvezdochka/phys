var reductor = 1;

Object.prototype.each = function(callback) {
    var i, key, value;
    for (key in this)
    {
        if (this.hasOwnProperty(key))
        {
            value = this[key];
            callback(value, key);
        }
    }
};

Object.prototype.toList = function() {
    var list = [];
    this.each(function(value) { list.push(value); });
    return list;
};

function init(environ)
{
    var phys = new Phys(); 

    var wrapper = d3.select('#canvas');
    var width = wrapper.node().clientWidth;
    var height = wrapper.node().clientHeight;

    var canvas = wrapper.append('svg');
    canvas.attr('width', width)
          .attr('height', height);

    var defs = canvas.append('defs');
    var marker = defs.append('marker');
    marker.attr('id', 'arrow')
          .attr('refX', 15)
          .attr('refY', 5)
          .attr('orient', 'auto')
          .style('overflow', 'visible');

    marker.append('path')
          .attr('d', 'M 0 0 L 15 5 L 0 10 z');

    canvas = canvas.append('g');
    canvas.attr('transform', 'translate(0, '+ height +'),'+ 
                             'scale(1, -1)');
    
    /* Размеры холста для создания BoundboxBehaviour'а */
    var box =
    {
        'topLeft': {'x': 0, 'y': height},
        'bottomRight': {'x': width, 'y': 0}
    }

    /* Временный реестр объектов для воссоздания окружения */  
    var registry = {'images': {}, 'bodies': {}, 'behaviours': {}};

    reductor = environ.reductor;

    /* Восстанавливаем изображения */            
    environ.images.each(function(image, key) {
        var node = new Image();
        node = d3.select(node);

        var width = ('width' in image ? image.width : null);
        var height = ('height' in image ? image.height : null);

        var filename = image.url.split('/').pop();
        filename = filename.split('.');

        var name = filename[0];
        var ext = filename[1];

        node.attr('src', image.url)
            .on('load', function() 
            {
                 var canvas = document.createElement('canvas');
                 canvas.width = this.width;
                 canvas.height = this.height;

                 var ctx = canvas.getContext('2d');
                 ctx.drawImage(this, 0, 0);

                 var data = canvas.toDataURL('image/' + ext);
                 defs.append('image')
                     .attr('id', name)
                     .attr('xlink:href', data)
                     .attr('width', width || this.width)
                     .attr('height', height || this.height)
                     .attr('transform', 'scale(1, -1)');
            });

        registry.images[key] = name;
    });

    /* Воссоздаём тела */
    environ.bodies.each(function(b, key)
    {
        var body = phys.createBody(b.id, b.mass, b.pos.x, b.pos.y);
        phys.registerBody(body);

        if ('prevPos' in b)
        {   
            var pos = b.prevPos;
            pos = phys.createVector(pos.x, pos.y);
            body.setPrevPos(pos);
        }

        if ('velocity' in b)
        {   
            var velocity = b.velocity;
            velocity = phys.createVector(velocity.x, velocity.y);
            body.setExtantVelocityVector(velocity);
        }

        /* Сохраняем тело под его ключом в реестр для быстрого доступа, 
        чтобы производить дополнительные операции */
        registry.bodies[key] = body;
        
        var imageId = '#' + registry.images[b.imageKey];
        var radius = body.getRadius();

        var use = canvas.append('use');
        use.attr('xlink:href', imageId)
           .attr('class', 'body')
           .attr('x', function(d) { return body.getPos().x - radius; })
           .attr('y', function(d) { return body.getPos().y + radius; })
           //.attr('r', function(d) { return d.getMass(); })
        
        body.onMoveBy(function()
        {
            use.attr('x', body.getPos().x - radius)
               .attr('y', body.getPos().y + radius);
        })
    });

    var behaviourCreators = 
    {
        'attracts': function(body1, body2)
        {
            return phys.createAttractionBehaviour(body1, body2);
        },

        'collides': function(body1, body2)
        {
            return phys.createCollisionBehaviour(body1, body2);
        },

        'boundbox': function()
        {
            return phys.createBoundBoxBehaviour(box.topLeft.x, 
                                                box.topLeft.y,
                                                box.bottomRight.x,
                                                box.bottomRight.y)
        }
    }

    /* Настраиваем behaviour'ы */
    environ.bodies.each(function(bodyData, bodyKey)
    {
        bodyData.behaviours.each(function(bodyKeys, name) 
        {
            if (name == 'boundbox')
            {
                 var create = behaviourCreators[name];
                 var body = registry.bodies[bodyKey];

                 var behaviour = create();
                 body.attachBehaviour(behaviour);

                 return;
            }

            bodyKeys.forEach(function(anotherBodyKey) 
            {
                /* Выбираем ключи так, чтобы меньший всегда был первым */
                var key1 = bodyKey < anotherBodyKey ? bodyKey : anotherBodyKey;
                var key2 = bodyKey < anotherBodyKey ? anotherBodyKey : bodyKey;

                var behaviourKey = name + '-' + key1 + '-' + key2;
                if (behaviourKey in registry.behaviours)
                {
                    /* Если behaviour для такой пары тел есть, значит 
                    соответствующий объект уже был создан и настроен */
                    return;
                }

                var body1 = registry.bodies[bodyKey];
                var body2 = registry.bodies[anotherBodyKey];

                var create = behaviourCreators[name];
                var behaviour = create(body1, body2);

                body1.attachBehaviour(behaviour);
                body2.attachBehaviour(behaviour);

                registry.behaviours[behaviourKey] = true;
            });
        });
    });

    console.info(registry.behaviours);

    d3.select('#makeStep').on('click', function() 
    { 
        d3.selectAll('.body_border').remove();

        phys.step(); 
        var stepNumber = phys.getStepNumber();
        d3.select('#stepNumber').text('Step number: '+ stepNumber);
    });

    var stepInterval = null;
    d3.select('#makeRun').on('click', function() 
    { 
        d3.selectAll('.body_border').remove();

        stepInterval = window.setInterval(function() 
        { 
            phys.step(); 
            var stepNumber = phys.getStepNumber();
            d3.select('#stepNumber').text('Step number: '+ stepNumber);
        }, 100); 
    });

    d3.select('#makePause').on('click', function()
    {
        clearInterval(stepInterval);
        canvas.selectAll('.body_border')
              .data(registry.bodies.toList())
              .enter()
                  .insert('circle')
                  .attr('cx', function(d) {return d.getPos().x; })
                  .attr('cy', function(d) {return d.getPos().y; })
                  .attr('r', function(d) {return d.getRadius(); })
                  .attr('class', 'body_border');
    })

    var debug = canvas.append('g');
    debug.attr('id', 'debug');

    phys.drawVector = function(pos, vector)
    {
        var vec = debug.append('line');
        vec.attr('class', 'vector')
           .attr('x1', pos.x)
           .attr('y1', pos.y)
           .attr('x2', vector.x)
           .attr('y2', vector.y);
    }

    phys.clearDebugLayer = function()
    {
        d3.select('#debug *').remove();
    }
}