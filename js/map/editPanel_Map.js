var MAP_EDITPANEL = (function(){
    function initPanel(){
        document.querySelectorAll('#mapEditPanel input').forEach((input) => {
            input.addEventListener('change', function(e){
                var action, layer;
                switch (+e.currentTarget.value) {
                        case 0:{
                            action = 'add';
                            layer = 'address'
                        }
                            break;
                        case 1:{
                            action = 'edit';
                            layer = 'address'
                        }
                            break;
                        case 2:{
                            action = 'remove';
                            layer = 'address'
                        }
                            break;
                        case 3:{
                            action = 'add';
                            layer = 'street'
                        }
                            break;
                        case 4:{
                            action = 'edit';
                            layer = 'street'
                        }
                            break;
                        case 5:{
                            action = 'remove';
                            layer = 'street'
                        }
                            break;
    
                }
                _dispatchEvent(_createEvent('map_editpanel_changed', {layer : layer, action : action}));
            }, null);
        });
    }

    // EVENTS-----------------------------------------------------------------------------------
    //createEvent
    function _createEvent(eventName, data){
        return new CustomEvent(eventName, {detail: data});
    }
    //dispatchEvent
    function _dispatchEvent(event){
        window.dispatchEvent(event);
    }

    return {
        initPanel:initPanel
    }
})();