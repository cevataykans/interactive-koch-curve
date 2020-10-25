function generateKochPoints( shapePoints, numOfIterations)
{
    var kochPoints = [];
    for ( let i = 0; i < shapePoints.length - 1; i++)
    {
        // Find all koch points between shape vertices (repeats vertices p1-p2 then p2-p3 ..... pn-p1 => edges can be colored straight colors)
        generateKochPointsA( shapePoints[ i], shapePoints[ i + 1], kochPoints, numOfIterations);
    }
    
    generateKochPointsA( shapePoints[ shapePoints.length - 1], shapePoints[ 0], kochPoints, numOfIterations);
    return kochPoints;
}

function generateKochPointsA( p1, p2, kochPoints, numOfIterations)
{
    if ( numOfIterations > 0)
    {
        // find koch points between two points
        let dividedPoints = findKochPoints( p1, p2);
        for ( let i = 0; i < dividedPoints.length - 1; i++)
        {
            // find koch points within the koch points
            generateKochPointsA( dividedPoints[ i], dividedPoints[ i + 1], kochPoints, numOfIterations - 1);
        }
    }
    else
    {
        // num of iteration 0, add found koch points
        kochPoints.push( p1);
        kochPoints.push( p2);
    }
}

function findKochPoints( p1, p2)
{
    var foundPoints = [];
    foundPoints.push( p1);
    // console.log( "First vector: " + foundPoints[ 0][ 0] + " | " + foundPoints[ 0][ 1] + " length: " + foundPoints[ 0].length);

    var secPoint = mix( p1, p2, 0.25);
    foundPoints.push( secPoint);
    // console.log( "Sec vector: " + foundPoints[ 1][ 0] + " | " + foundPoints[ 1][ 1] + " length: " + foundPoints[ 1].length);

    var difVector = subtract( secPoint, p1);
    // console.log( "Dif vector: " + difVector[ 0] + " | " + difVector[ 1] + " length: " + difVector.length);
    var thirdPointDirection = rotate90( difVector, 1);
    // console.log( "Third Vector direction vector: " + thirdPointDirection[ 0] + " | " + thirdPointDirection[ 1] + " length: " + thirdPointDirection.length);
    var thirdPoint = add( secPoint, thirdPointDirection);
    foundPoints.push( thirdPoint);
    // console.log( "Third vector: " + foundPoints[ 2][ 0] + " | " + foundPoints[ 2][ 1] + " length: " + foundPoints[ 2].length);

    var fourthPoint = add( thirdPoint, difVector);
    foundPoints.push( fourthPoint);
    // console.log( "Fourth vector: " + foundPoints[ 3][ 0] + " | " + foundPoints[ 3][ 1] + " length: " + foundPoints[ 3].length);
    
    var mirrorPoint = mix( p1, p2, 0.5);
    foundPoints.push( mirrorPoint);
    
    var sixthPointDirection = rotate90( difVector, 0);
    var sixthPoint = add( mirrorPoint, sixthPointDirection);
    foundPoints.push( sixthPoint);

    var seventhPoint = add( sixthPoint, difVector);
    foundPoints.push( seventhPoint);

    var eightPoint = mix( p1, p2, 0.75);
    foundPoints.push( eightPoint);
    
    foundPoints.push( p2);

    return foundPoints;
}