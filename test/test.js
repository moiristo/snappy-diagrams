(function(){
  diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 0 });

  cell1 = diagram.addCell(0,0);
  cell2 = diagram.addCell(3,0);
  cell3 = diagram.addCell(6,0);

  cell4 = diagram.addCell(0,5);
  cell5 = diagram.addCell(3,5);
  cell6 = diagram.addCell(6,5);

  cell7 = diagram.addCell(0,10);
  cell8 = diagram.addCell(3,10);
  cell9 = diagram.addCell(6,10);

  cell10 = diagram.addCell(1,0, {shape: 'circle'});
  cell11 = diagram.addCell(0,1, {shape: 'ellipse'});
  cell12 = diagram.addCell(1,1, {attrs: {class: 'orphan'}, shape: 'circle'});

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
  diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 3 });

  cell1 = diagram.addCell(0,0, { text: 'Nedforce Informatica Specialisten' });
  cell2 = diagram.addCell(1,0, { text: 'National Aeronautics and Space Administration' });
  cell3 = diagram.addCell(2,0, { text: 'Peder Inc.' });
  cell4 = diagram.addCell(1,2, { text: 'Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus.'});
  cell5 = diagram.addCell(1,4);

  diagram.addConnector(cell1, cell4, {style: 'line', startAnchor: 'bottom-middle'});
  diagram.addConnector(cell2, cell4);
  diagram.addConnector(cell3, cell4, {startAnchor: 'bottom-middle'});
  diagram.addConnector(cell4, cell5, {style: 'double'});

  diagram.draw();
})();
