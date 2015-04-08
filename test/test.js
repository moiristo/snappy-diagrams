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

  cell10 = diagram.addCell(1,0);
  cell11 = diagram.addCell(0,1);
  cell12 = diagram.addCell(1,1, 'orphan');

  diagram.addArrow(cell5, cell1);
  diagram.addArrow(cell5, cell2);
  diagram.addArrow(cell5, cell3);
  diagram.addArrow(cell5, cell4);
  diagram.addArrow(cell5, cell6);
  diagram.addArrow(cell5, cell7);
  diagram.addArrow(cell5, cell8);
  diagram.addArrow(cell5, cell9);

  diagram.draw();
})();

(function(){
  diagram = new SnappyDiagram({ width: 800, height: 600, boxRadius: 0 });

  cell1 = diagram.addCell(0,0);
  cell2 = diagram.addCell(1,0);
  cell3 = diagram.addCell(2,0);
  cell4 = diagram.addCell(1,2);
  cell5 = diagram.addCell(1,4);

  diagram.addArrow(cell1, cell4, {startAnchor: 'bottom-middle'});
  diagram.addArrow(cell2, cell4);
  diagram.addArrow(cell3, cell4, {startAnchor: 'bottom-middle'});
  diagram.addArrow(cell4, cell5);

  diagram.draw();
})();
