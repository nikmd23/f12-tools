window.onload = function() {
    // wire up click handlers
    [].forEach.call(document.querySelectorAll('.comparison input[type=checkbox]'), function(e){
        e.onchange = function(i){
            var target = i.target,
                lbl = document.querySelector('label[for='+ target.id +']');

            if (target.checked){
                target.dataset.priority = ++counter;

                lbl.className = lbl.className.replace('-disabled', '');
                [].forEach.call(document.querySelectorAll(target.dataset.columnSelector), function(e){
                    e.classList.remove('hidden-col');
                });

                enforceColumns();
            }
            else {
                lbl.className = lbl.className.replace('-24', '-disabled-24');
                [].forEach.call(document.querySelectorAll(target.dataset.columnSelector), function(e){
                    e.classList.add('hidden-col');
                });
            }
        };
    });

    [].forEach.call(document.querySelectorAll('.comparison label'), function(e){ // fix iOS bug: http://stackoverflow.com/questions/7358781/tapping-on-label-in-mobile-safari
        e.onclick = function(){};
    });

    var columnCount = 4,
        large = window.matchMedia("(max-width: 980px)"),
        medium = window.matchMedia("(max-width: 784px)"),
        small = window.matchMedia("(max-width: 588px)"),
        counter = columnCount, // is this the right logic?
        switcher = document.querySelector('.comparison thead th:first-of-type');

    large.addListener(updateColumnCount);
    updateColumnCount(large, true);

    medium.addListener(updateColumnCount);
    updateColumnCount(medium, true);

    small.addListener(updateColumnCount);
    updateColumnCount(small, false);

    function updateColumnCount(mql, skipEnforceColumns) {
        if (mql.matches)
            columnCount = Math.max(columnCount - 1, 1);
        else
            columnCount = Math.min(columnCount + 1, 4);

        if (columnCount === 4)
            switcher.classList.add('hide-browser-switcher');
        else
            switcher.classList.remove('hide-browser-switcher');

        if (!skipEnforceColumns)
            enforceColumns();
    }

    function enforceColumns(){
        var checked = document.querySelectorAll('.comparison input:checked'),
            overage = checked.length - columnCount,
            evt = document.createEvent('HTMLEvents');

        if (overage === 0) return;

        evt.initEvent('change', true, true);
        if (overage > 0){
            // turn off "over" columns
            [].slice.call(checked,0)
                .sort(function (a, b) {
                    return a.dataset.priority - b.dataset.priority;
                })
                .some(function (e, i) {
                    if (i >= overage) return false;

                    e.checked = false;
                    e.dispatchEvent(evt);
                });
        } else {
            // turn on "under" columns
            [].slice.call(document.querySelectorAll('.comparison input:not(:checked)'),0)
                .sort(function (a, b) {
                    return b.dataset.priority - a.dataset.priority;
                })
                .some(function (e, i) {
                    if (i >= Math.abs(overage)) return false;

                    e.checked = true;
                    e.dispatchEvent(evt);
                });
        }
    }
};