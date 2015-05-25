(function(){
  var diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 10, allowDrag: true });

  cell1 = diagram.addBox(0,0);
  cell2 = diagram.addBox(3,0);
  cell3 = diagram.addBox(6,0);

  cell4 = diagram.addBox(0,5);
  cell5 = diagram.addCircle(3,5);
  cell6 = diagram.addBox(6,5);

  cell7 = diagram.addBox(0,10);
  cell8 = diagram.addBox(3,10);
  cell9 = diagram.addParallelogram(6,10);

  cell10 = diagram.addCircle(1,0);
  cell11 = diagram.addEllipse(0,1);
  cell12 = diagram.addCircle(2,1, {attrs: {class: 'orphan'}});

  diagram.addConnector(cell5, cell1);
  diagram.addConnector(cell5, cell2);
  diagram.addConnector(cell5, cell3);
  diagram.addConnector(cell5, cell4);
  diagram.addConnector(cell5, cell6);
  diagram.addConnector(cell5, cell7);
  diagram.addConnector(cell5, cell8);
  diagram.addConnector(cell5, cell9);

  diagram.draw();
})();

(function(){
  var diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 20 });

  cell1 = diagram.addBox(0,0);
  cell2 = diagram.addBox(2,0);
  cell3 = diagram.addBox(4,0);

  cell4 = diagram.addBox(0,2);
  cell5 = diagram.addDiamond(2,2);
  cell6 = diagram.addParallelogram(4,2);

  cell7 = diagram.addBox(0,4);
  cell8 = diagram.addBox(2,4);
  cell9 = diagram.addParallelogram(4,4);

  diagram.addConnector(cell5, cell1);
  diagram.addConnector(cell5, cell2);
  diagram.addConnector(cell5, cell3);
  diagram.addConnector(cell5, cell4);
  diagram.addConnector(cell5, cell6);
  diagram.addConnector(cell5, cell7);
  diagram.addConnector(cell5, cell8);
  diagram.addConnector(cell5, cell9);

  diagram.draw();
})();

(function(){
  var diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 3 });

  cell1 = diagram.addBox(0,0, { text: 'Nedforce Informatica Specialisten' });
  cell2 = diagram.addBox(1,0, { text: 'National Aeronautics and Space Administration' });
  cell3 = diagram.addBox(2,0, { text: 'Peder Inc.' });
  cell4 = diagram.addBox(1,2, { text: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus.'});
  cell5 = diagram.addBox(1,4);

  diagram.addConnector(cell1, cell4, {style: 'line', startAnchor: 'bottom-middle'});
  diagram.addConnector(cell2, cell4);
  diagram.addConnector(cell3, cell4, {startAnchor: 'bottom-middle'});
  diagram.addConnector(cell4, cell5, {style: 'double'});

  diagram.draw();

  window.onload = function() {
    document.getElementById('export-png-button').onclick = function(){ diagram.export() };
    document.getElementById('export-svg-button').onclick = function(){ diagram.export('svg') };
  };
})();