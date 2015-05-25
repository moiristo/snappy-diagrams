describe 'SnappyDiagram', ->
  diagram = null

  beforeEach ->
    diagram = new SnappyDiagram width: 800, height: 600, boxRadius: 5

  it 'sets the dimensions of the surface', ->
    expect(diagram.options.width).toBe 800
    expect(diagram.options.height).toBe 600

  it 'adds a box', ->
    expect diagram.addBox(0,0, text: 'Box 1').toString()
      .toBe 'SnappyBox@0,0:Box 1'

  it 'adds a parallelogram', ->
    expect diagram.addParallelogram(1,0, text: 'Parallelogram 1').toString()
      .toBe 'SnappyParallelogram@1,0:Parallelogram 1'

  it 'adds a diamond', ->
    expect diagram.addDiamond(0,1, text: 'Diamond 1').toString()
      .toBe 'SnappyDiamond@0,1:Diamond 1'

  it 'adds a circle', ->
    expect diagram.addCircle(0,2, text: 'Circle 1').toString()
      .toBe 'SnappyCircle@0,2:Circle 1'

  it 'adds an ellipse', ->
    expect diagram.addEllipse(1,1, text: 'Ellipse 1').toString()
      .toBe 'SnappyEllipse@1,1:Ellipse 1'

  it 'adds a connector', ->
    box1 = diagram.addBox(0,0, text: 'Box 1')
    box2 = diagram.addBox(1,0, text: 'Box 2')
    connector = diagram.addConnector box1, box2, style: 'double'

    expect connector.toString()
      .toBe "SnappyConnector:(#{box1.toString()})<->(#{box2.toString()})"

  it 'calculates the dimensions based on cell and row count', ->
    box1 = diagram.addBox(0,0, text: 'Box 1')
    box2 = diagram.addBox(1,0, text: 'Box 2')
    box3 = diagram.addBox(0,1, text: 'Box 3')

    diagram.setDimensions()
    expect diagram.cellWidth
      .toBe diagram.options.width / 2
    expect diagram.cellHeight
      .toBe diagram.options.height / 2

  it 'draws the diagram', ->
    box1 = diagram.addBox(0,0, text: 'Box 1')
    box2 = diagram.addBox(1,0, text: 'Box 2')
    connector = diagram.addConnector box1, box2, style: 'double'
    expect(diagram.draw()).toBe true

  it 'creates a triangle marker', ->
    expect diagram.triangleMarker(7, 10)
      .toBeTruthy()

  it 'exports the current diagram', ->
    expect diagram.export()
      .toBeTruthy()